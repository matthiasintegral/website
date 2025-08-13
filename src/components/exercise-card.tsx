import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, FileText } from "lucide-react";
import { Exercise } from "@/types";
import { cn } from "@/lib/utils";
import { MathContent } from "@/components/math-content";

interface ExerciseCardProps {
  exercise: Exercise;
  showSolveButton?: boolean;
  className?: string;
}

export function ExerciseCard({
  exercise,
  showSolveButton = true,
  className,
}: ExerciseCardProps) {
  const getStatusColor = (status: Exercise["status"]) => {
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

  const getLevelColor = (level: Exercise["level"]) => {
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
    <Card
      className={cn("exercise-card-hover glassmorphism shadow-lg", className)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">
            <Link
              href={`/exercises/${exercise.id}`}
              className="hover:text-purple-600 transition-colors"
            >
              {exercise.title}
            </Link>
          </CardTitle>
          <Badge
            variant="secondary"
            className={cn(
              "text-xs capitalize",
              getStatusColor(exercise.status)
            )}
          >
            {exercise.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Statement Preview */}
        <div className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
          <MathContent content={exercise.statement} />
        </div>

        {/* Category and Level */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {exercise.category}
          </Badge>
          <Badge
            variant="secondary"
            className={cn("text-xs capitalize", getLevelColor(exercise.level))}
          >
            {exercise.level}
          </Badge>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            <span>{exercise.createdAt.toLocaleDateString()}</span>
          </div>
          {exercise.authorId && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>Author</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showSolveButton && (
          <div className="flex gap-2 pt-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/exercises/${exercise.id}`}>
                <FileText className="h-3 w-3 mr-1" />
                View Details
              </Link>
            </Button>
            {exercise.status === "open" && (
              <Button
                asChild
                size="sm"
                className="flex-1 exercise-gradient text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href={`/submit?exerciseId=${exercise.id}`}>Solve</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
