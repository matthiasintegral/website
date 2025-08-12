import { z } from "zod";
import { ExerciseCategorySchema } from "./exercise-category-dto";

export const FindAllExerciseCategoryResponseSchema = z.array(
  ExerciseCategorySchema
);

export type FindAllExerciseCategoryResponseDTO = z.infer<
  typeof FindAllExerciseCategoryResponseSchema
>;
