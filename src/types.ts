export interface Exercise {
  id: string;
  title: string;
  statement: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "open" | "pending" | "finished";
  createdAt: Date;
  imageUrl?: string;
  authorId?: string;
}

export interface Solution {
  id: string;
  exerciseId: string;
  content: string;
  imageUrl?: string;
  authorId?: string;
  createdAt: Date;
  isCorrect?: boolean;
}

export interface UploadState {
  file: File | null;
  preview: string | null;
  isProcessing: boolean;
  convertedText: string;
  error: string | null;
}

export interface ExerciseFormData {
  title: string;
  statement: string;
  category: string;
  level: Exercise["level"];
  response?: string;
}

export type FilterOptions = {
  search: string;
  category: string;
  status: Exercise["status"] | "all";
  level: Exercise["level"] | "all";
};
