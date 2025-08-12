import { z } from "zod";

export const ExerciseCategorySchema = z.enum([
  "Algebra",
  "Geometry",
  "Calculus",
  "Statistics",
  "Number Theory",
  "Trigonometry",
  "Linear Algebra",
  "Differential Equations",
]);

export type ExerciseCategory = z.infer<typeof ExerciseCategorySchema>;
