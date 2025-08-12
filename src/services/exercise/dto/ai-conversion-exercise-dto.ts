import { z } from "zod";
import { ExerciseCategorySchema } from "./exercise-category-dto";

export const AIConversionExerciseResponseSchema = z.object({
  title: z.string(),
  statement: z.string(),
  solution: z.string(),
  category: ExerciseCategorySchema,
  confidenceScore: z.number().min(0).max(1),
  message: z.string().default("AI conversion completed successfully"),
});

export type AIConversionExerciseResponseDTO = z.infer<
  typeof AIConversionExerciseResponseSchema
>;
