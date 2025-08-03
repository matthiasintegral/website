"use client";

import { useState, Suspense } from "react";
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
import { Upload, RefreshCw, CheckCircle, PenTool } from "lucide-react";
import { UploadState, FormData } from "@/lib/types";
import { mockExercises, categories, levels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function SubmitPageContent() {
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get("exerciseId");
  const isSubmittingSolution = !!exerciseId;

  // Find the exercise if we're submitting a solution
  const exercise = isSubmittingSolution
    ? mockExercises.find((ex) => ex.id === exerciseId)
    : null;

  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    preview: null,
    isProcessing: false,
    convertedText: "",
    error: null,
  });

  const [formData, setFormData] = useState<FormData>({
    title: "",
    statement: "",
    category: "",
    level: "beginner",
    response: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadState((prev) => ({
      ...prev,
      file,
      preview: URL.createObjectURL(file),
      error: null,
    }));

    // Simulate AI processing
    simulateAIProcessing(file);
  };

  // Simulate AI text conversion
  const simulateAIProcessing = async (uploadedFile: File) => {
    setUploadState((prev) => ({ ...prev, isProcessing: true }));

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Processing file:", uploadedFile.name); // Use the uploadedFile parameter

    if (isSubmittingSolution) {
      // When solving an existing exercise, only fill the response
      const mockSolutionText =
        "Step 1: Start with the equation x² - 5x + 6 = 0\nStep 2: Factor the quadratic: (x-2)(x-3) = 0\nStep 3: Solve for x: x = 2 or x = 3";

      setUploadState((prev) => ({
        ...prev,
        isProcessing: false,
        convertedText: mockSolutionText,
      }));

      setFormData((prev) => ({
        ...prev,
        response: mockSolutionText,
      }));
    } else {
      // When creating a new exercise, fill all fields with AI mock data
      const mockExerciseData = {
        title: "Quadratic Equation Factoring Problem",
        category: "Algebra",
        level: "intermediate" as const,
        statement:
          "Solve the quadratic equation x² - 7x + 12 = 0 by factoring.\n\nShow all your work and verify your solution by substituting back into the original equation.",
        response:
          "Solution:\nStep 1: Factor the quadratic expression\nx² - 7x + 12 = (x - 3)(x - 4)\n\nStep 2: Set each factor equal to zero\nx - 3 = 0  or  x - 4 = 0\n\nStep 3: Solve for x\nx = 3  or  x = 4\n\nVerification:\nFor x = 3: (3)² - 7(3) + 12 = 9 - 21 + 12 = 0 ✓\nFor x = 4: (4)² - 7(4) + 12 = 16 - 28 + 12 = 0 ✓",
      };

      setUploadState((prev) => ({
        ...prev,
        isProcessing: false,
        convertedText: mockExerciseData.statement,
      }));

      setFormData((prev) => ({
        ...prev,
        title: mockExerciseData.title,
        category: mockExerciseData.category,
        level: mockExerciseData.level,
        statement: mockExerciseData.statement,
        response: mockExerciseData.response,
      }));
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadState((prev) => ({
        ...prev,
        file,
        preview: URL.createObjectURL(file),
        error: null,
      }));
      simulateAIProcessing(file);
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
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
                          Drop your image here
                        </p>
                        <p className="text-slate-500">
                          or click to browse files
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          Supports JPG, PNG, and other image formats
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Processing Status */}
              {uploadState.isProcessing && (
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <RefreshCw className="h-4 w-4 animate-spin text-purple-600" />
                  <span className="text-sm text-purple-800">
                    Converting handwriting to text with AI...
                  </span>
                </div>
              )}

              {/* Converted Text Preview */}
              {uploadState.convertedText && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">
                      AI Conversion Complete
                    </span>
                  </div>
                  <p className="text-sm text-emerald-700 whitespace-pre-wrap">
                    {uploadState.convertedText}
                  </p>
                  <p className="text-xs text-emerald-600 mt-2">
                    {isSubmittingSolution
                      ? "Text has been copied to the solution field → You can edit it there"
                      : "All fields have been auto-filled (title, category, level, statement, and optional solution) → You can edit them in the form"}
                  </p>
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
                          {categories.map((category) => (
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
