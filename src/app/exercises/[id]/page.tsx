import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PenTool,
  Calendar,
  User,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";
import { mockExercises, mockSolutions } from "@/data";
import { cn } from "@/lib/utils";

interface ExerciseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ExerciseDetailPage({
  params,
}: ExerciseDetailPageProps) {
  const { id } = await params;
  const exercise = mockExercises.find((ex) => ex.id === id);

  if (!exercise) {
    notFound();
  }

  // Get solutions for this exercise
  const solutions = mockSolutions.filter(
    (solution) => solution.exerciseId === exercise.id
  );

  const getStatusColor = (status: typeof exercise.status) => {
    switch (status) {
      case "open":
        return "exercise-status-open";
      case "pending":
        return "exercise-status-pending";
      case "finished":
        return "exercise-status-finished";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getLevelColor = (level: typeof exercise.level) => {
    switch (level) {
      case "beginner":
        return "exercise-level-beginner";
      case "intermediate":
        return "exercise-level-intermediate";
      case "advanced":
        return "exercise-level-advanced";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/exercises">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exercises
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exercise Header */}
            <Card className="glassmorphism shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {exercise.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{exercise.category}</Badge>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "capitalize",
                          getLevelColor(exercise.level)
                        )}
                      >
                        {exercise.level}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "capitalize",
                          getStatusColor(exercise.status)
                        )}
                      >
                        {exercise.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Exercise Statement */}
                  <div>
                    <h3 className="font-semibold mb-2">Problem Statement</h3>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {exercise.statement}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-6 text-sm text-slate-500 pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Created {exercise.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    {exercise.authorId && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>By Author</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>
                        {solutions.length} Solution
                        {solutions.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Solutions Section */}
            <Card className="glassmorphism shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Solutions ({solutions.length})</span>
                  {exercise.status === "open" && (
                    <Button
                      asChild
                      size="sm"
                      className="exercise-gradient text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href={`/submit?exerciseId=${exercise.id}`}>
                        <PenTool className="mr-2 h-3 w-3" />
                        Add Solution
                      </Link>
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {solutions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-slate-400 mb-4">
                      <FileText className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      No solutions yet
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Be the first to solve this exercise!
                    </p>
                    {exercise.status === "open" && (
                      <Button
                        asChild
                        className="exercise-gradient text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Link href={`/submit?exerciseId=${exercise.id}`}>
                          <PenTool className="mr-2 h-4 w-4" />
                          Submit Solution
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {solutions.map((solution, index) => (
                      <div
                        key={solution.id}
                        className="border rounded-lg p-4 bg-white/80 glassmorphism"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-900">
                              Solution #{index + 1}
                            </span>
                            {solution.isCorrect && (
                              <Badge
                                variant="secondary"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200"
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>
                              {solution.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Solution Content */}
                        <div className="space-y-3">
                          <div className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                            {solution.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Exercise Stats */}
            <Card className="glassmorphism shadow-lg">
              <CardHeader>
                <CardTitle>Exercise Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Category:</span>
                  <Badge variant="outline">{exercise.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Difficulty:</span>
                  <Badge
                    variant="secondary"
                    className={cn("capitalize", getLevelColor(exercise.level))}
                  >
                    {exercise.level}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "capitalize",
                      getStatusColor(exercise.status)
                    )}
                  >
                    {exercise.status}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-slate-600">Solutions:</span>
                  <span className="font-medium">{solutions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Created:</span>
                  <span className="font-medium">
                    {exercise.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Related Exercises */}
            <Card className="glassmorphism shadow-lg">
              <CardHeader>
                <CardTitle>Related Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockExercises
                    .filter(
                      (ex) =>
                        ex.id !== exercise.id &&
                        ex.category === exercise.category
                    )
                    .slice(0, 3)
                    .map((relatedExercise) => (
                      <Link
                        key={relatedExercise.id}
                        href={`/exercises/${relatedExercise.id}`}
                        className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">
                          {relatedExercise.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              getLevelColor(relatedExercise.level)
                            )}
                          >
                            {relatedExercise.level}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              getStatusColor(relatedExercise.status)
                            )}
                          >
                            {relatedExercise.status}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
