"use client";

import { useEffect, useRef, useState, Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  RefreshCw,
  CheckCircle,
  PenTool,
  AlertCircle,
} from "lucide-react";
import { UploadState, ExerciseFormData } from "@/types";
import { mockExercises, levels } from "@/data";
import { cn } from "@/lib/utils";
import { MathContent } from "@/components/math-content";
import { findAllExerciseCategory } from "@/services/exercise";
import { aiConversionAction, type AIConversionActionState } from "./_actions";
import type { AIConversionExerciseResponseDTO } from "@/services/exercise/dto";

function SubmitPageContent() {
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get("exerciseId");
  const isSubmittingSolution = !!exerciseId;

  // Find the exercise if we're submitting a solution
  const exercise = isSubmittingSolution
    ? mockExercises.find((ex) => ex.id === exerciseId)
    : null;

  const [uploadState, setUploadState] = useState<
    UploadState & {
      processingProgress: number;
      canCancel: boolean;
    }
  >({
    file: null,
    preview: null,
    isProcessing: false,
    convertedText: "",
    error: null,
    processingProgress: 0,
    canCancel: false,
  });

  const [formData, setFormData] = useState<ExerciseFormData>({
    title: "",
    statement: "",
    category: "",
    level: "beginner",
    response: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [categoriesState, setCategoriesState] = useState<string[]>([]);

  const [aiState, formAction] = useActionState<
    AIConversionActionState | null,
    FormData
  >(aiConversionAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const progressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Load categories from API
    (async () => {
      try {
        const result = await findAllExerciseCategory();
        setCategoriesState(result);
      } catch (e) {
        console.error("Failed to load categories", e);
        setCategoriesState([]);
      }
    })();
  }, []);

  // Handle file upload -> preview + auto-submit the form to server action
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploadState((prev) => ({
      ...prev,
      file: files[0], // Keep first file for preview
      preview: URL.createObjectURL(files[0]),
      error: null,
      processingProgress: 0,
      canCancel: false,
    }));

    // Start progress simulation and submit to server action
    setUploadState((prev) => ({ ...prev, isProcessing: true }));
    if (progressTimerRef.current)
      window.clearInterval(progressTimerRef.current);
    progressTimerRef.current = window.setInterval(() => {
      setUploadState((prev) => ({
        ...prev,
        processingProgress: Math.min(prev.processingProgress + 1, 95),
      }));
    }, 1200);

    // Append files to the form and submit via server action
    // Note: The input is inside the form; requestSubmit will serialize it
    formRef.current?.requestSubmit();
  };

  // Handle server action responses
  useEffect(() => {
    if (!aiState) return;
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    if (aiState.ok) {
      const result: AIConversionExerciseResponseDTO = aiState.data;
      setUploadState((prev) => ({
        ...prev,
        isProcessing: false,
        convertedText: isSubmittingSolution
          ? result.solution
          : result.statement,
        processingProgress: 100,
        canCancel: false,
        error: null,
      }));

      if (isSubmittingSolution) {
        setFormData((prev) => ({ ...prev, response: result.solution }));
      } else {
        setFormData((prev) => ({
          ...prev,
          title: result.title,
          statement: result.statement,
          category: result.category,
          response: result.solution,
        }));
      }
    } else {
      const errorMessage =
        aiState.error || "AI processing failed. Please try again.";
      setUploadState((prev) => ({
        ...prev,
        isProcessing: false,
        error: errorMessage,
        processingProgress: 0,
        canCancel: false,
      }));
      console.error("AI processing error:", errorMessage);
    }
  }, [aiState, isSubmittingSolution]);

  // Cancel AI processing (local only; server actions cannot be aborted easily)
  const cancelAIProcessing = () => {
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setUploadState((prev) => ({
      ...prev,
      isProcessing: false,
      processingProgress: 0,
      canCancel: false,
      error: "Processing cancelled by user",
    }));
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      setUploadState((prev) => ({
        ...prev,
        file: files[0], // Keep first file for preview
        preview: URL.createObjectURL(files[0]),
        error: null,
        processingProgress: 0,
        canCancel: false,
      }));
      // start progress simulation and submit to server action
      setUploadState((prev) => ({ ...prev, isProcessing: true }));
      if (progressTimerRef.current)
        window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = window.setInterval(() => {
        setUploadState((prev) => ({
          ...prev,
          processingProgress: Math.min(prev.processingProgress + 1, 95),
        }));
      }, 1200);
      formRef.current?.requestSubmit();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({
        title: "",
        statement: "",
        category: "",
        level: "beginner",
        response: "",
      });
      setUploadState({
        file: null,
        preview: null,
        isProcessing: false,
        convertedText: "",
        error: null,
        processingProgress: 0,
        canCancel: false,
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {isSubmittingSolution ? "Submit Solution" : "Submit Exercise"}
          </h1>
          <p className="text-slate-600 mt-2">
            {isSubmittingSolution
              ? `Submit your solution for: ${exercise?.title}`
              : "Upload your handwritten math problem and share it with the community"}
          </p>
        </div>

        {/* Exercise Context (if submitting solution) */}
        {isSubmittingSolution && exercise && (
          <Card className="mb-8 glassmorphism shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Exercise to Solve</span>
                <Badge variant="secondary" className="exercise-status-open">
                  {exercise.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">{exercise.title}</h3>
              <p className="text-slate-600 mb-4 whitespace-pre-wrap">
                {exercise.statement}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{exercise.category}</Badge>
                <Badge
                  variant="secondary"
                  className="exercise-level-intermediate"
                >
                  {exercise.level}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="glassmorphism shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Handwritten Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="space-y-4">
                <form ref={formRef} action={formAction} className="hidden">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    name="files"
                    id="file-upload"
                  />
                </form>
                <label
                  htmlFor="file-upload"
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer block",
                    uploadState.file
                      ? "border-purple-300 bg-purple-50"
                      : "border-slate-300 hover:border-purple-400 hover:bg-purple-50/50"
                  )}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {uploadState.preview ? (
                    <div className="space-y-4">
                      <Image
                        src={uploadState.preview}
                        alt="Uploaded content"
                        width={400}
                        height={192}
                        className="max-w-full h-48 object-contain mx-auto rounded"
                      />
                      <p className="text-sm text-slate-600">
                        {uploadState.file?.name}
                      </p>
                      <p className="text-xs text-purple-600 font-medium">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="p-3 bg-slate-100 rounded-full">
                          <Upload className="h-8 w-8 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-slate-900">
                          Drop your images here
                        </p>
                        <p className="text-slate-500">
                          or click to browse files (multiple files supported)
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          Supports JPG, PNG, and other image formats • Upload
                          multiple images for long exercises
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Enhanced Processing Status with Progress */}
              {uploadState.isProcessing && (
                <div className="space-y-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  {/* Progress Bar */}
                  <div className="w-full bg-purple-100 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadState.processingProgress}%` }}
                    />
                  </div>

                  {/* Status Messages */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm text-purple-800">
                        {uploadState.processingProgress < 30
                          ? "Analyzing handwriting..."
                          : uploadState.processingProgress < 70
                          ? "Processing mathematical content..."
                          : "Finalizing transcription..."}
                      </span>
                    </div>

                    {/* Cancel Button */}
                    {uploadState.canCancel && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelAIProcessing}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>

                  {/* Time Indicator */}
                  <p className="text-xs text-purple-600">
                    AI processing can take up to 2 minutes for complex
                    mathematical content
                  </p>
                </div>
              )}

              {/* Enhanced Error Handling */}
              {uploadState.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Processing Failed
                    </span>
                  </div>
                  <p className="text-sm text-red-700">{uploadState.error}</p>

                  {uploadState.error.includes("timeout") && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-red-600">
                        The AI processing took longer than expected. This can
                        happen with complex mathematical content.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => formRef.current?.requestSubmit()}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Converted Text Preview */}
              {uploadState.convertedText && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">
                      AI Conversion Complete
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Section */}
          <Card className="glassmorphism shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5" />
                {isSubmittingSolution ? "Your Solution" : "Exercise Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isSubmittingSolution && (
                  <>
                    {/* Exercise Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Exercise Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Enter a descriptive title..."
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesState.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Level */}
                    <div className="space-y-2">
                      <Label htmlFor="level">Difficulty Level</Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            level: value as
                              | "beginner"
                              | "intermediate"
                              | "advanced",
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map((level) => (
                            <SelectItem key={level} value={level}>
                              <span className="capitalize">{level}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Statement/Response */}
                <div className="space-y-2">
                  <Label htmlFor="content">
                    {isSubmittingSolution
                      ? "Your Solution"
                      : "Problem Statement"}
                    {uploadState.convertedText && (
                      <span className="text-xs text-emerald-600 ml-2">
                        (AI converted text - edit as needed)
                      </span>
                    )}
                  </Label>
                  <Textarea
                    id="content"
                    value={
                      isSubmittingSolution
                        ? formData.response
                        : formData.statement
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [isSubmittingSolution ? "response" : "statement"]:
                          e.target.value,
                      }))
                    }
                    placeholder={
                      isSubmittingSolution
                        ? "Describe your solution step by step..."
                        : "Describe the math problem or upload an image above..."
                    }
                    rows={8}
                    required
                    className="min-h-[200px]"
                  />
                  {/* LaTeX Preview */}
                  {(isSubmittingSolution ? formData.response : formData.statement) && (
                    <div className="mt-3 p-3 bg-slate-50 border rounded-lg">
                      <div className="text-xs font-medium text-slate-600 mb-2">
                        LaTeX Preview:
                      </div>
                      <MathContent 
                        content={(isSubmittingSolution ? formData.response : formData.statement) || ""}
                        className="text-sm text-slate-800"
                      />
                    </div>
                  )}
                </div>

                {/* Optional Response for new exercises */}
                {!isSubmittingSolution && (
                  <div className="space-y-2">
                    <Label htmlFor="response">
                      Your Solution (Optional)
                      {uploadState.convertedText && (
                        <span className="text-xs text-emerald-600 ml-2">
                          (AI generated solution - edit as needed)
                        </span>
                      )}
                    </Label>
                    <Textarea
                      id="response"
                      value={formData.response || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          response: e.target.value,
                        }))
                      }
                      placeholder="Provide your solution to help others understand the problem..."
                      rows={6}
                      className="min-h-[150px]"
                    />
                    {/* LaTeX Preview for Optional Response */}
                    {formData.response && (
                      <div className="mt-3 p-3 bg-slate-50 border rounded-lg">
                        <div className="text-xs font-medium text-slate-600 mb-2">
                          Solution LaTeX Preview:
                        </div>
                        <MathContent 
                          content={formData.response}
                          className="text-sm text-slate-800"
                        />
                      </div>
                    )}
                    <p className="text-xs text-slate-500">
                      You can provide a solution to your own exercise to help
                      other students learn.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full exercise-gradient text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      {isSubmittingSolution
                        ? "Submitting Solution..."
                        : "Submitting Exercise..."}
                    </>
                  ) : (
                    <>
                      <PenTool className="mr-2 h-4 w-4" />
                      {isSubmittingSolution
                        ? "Submit Solution"
                        : "Submit Exercise"}
                    </>
                  )}
                </Button>

                {/* Success Message */}
                {submitSuccess && (
                  <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-emerald-800 font-medium">
                      {isSubmittingSolution
                        ? "Solution submitted successfully!"
                        : "Exercise submitted successfully!"}
                    </span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubmitPageContent />
    </Suspense>
  );
}
