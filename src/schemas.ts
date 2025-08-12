import { z } from 'zod';

// Categories enum matching backend
export const CategorySchema = z.enum([
  "Algebra",
  "Geometry", 
  "Calculus",
  "Statistics",
  "Number Theory",
  "Trigonometry",
  "Linear Algebra",
  "Differential Equations"
]);

// Base exercise schema (without ID and timestamps)
export const ExerciseBaseSchema = z.object({
  title: z.string().min(1).max(200),
  statement: z.string().min(1),
  solution: z.string().min(1),
  category: CategorySchema
});

// Schema for creating a new exercise
export const ExerciseCreateSchema = ExerciseBaseSchema;

// Schema for updating an exercise  
export const ExerciseUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  statement: z.string().min(1).optional(),
  solution: z.string().min(1).optional(),
  category: CategorySchema.optional()
});

// Complete exercise schema (matches backend Exercise model)
export const ExerciseSchema = ExerciseBaseSchema.extend({
  id: z.string(),
  level: z.literal("advanced"), // Backend always sets to "advanced"
  status: z.literal("finished"), // Backend always sets to "finished" 
  createdAt: z.string().transform((str) => new Date(str)), // Transform ISO string to Date
  imagePaths: z.array(z.string()).default([]),
  confidenceScore: z.number().min(0).max(1)
});

// Exercise list response schema
export const ExerciseListSchema = z.object({
  exercises: z.array(ExerciseSchema),
  total: z.number(),
  page: z.number(),
  size: z.number()
});

// AI Conversion response schema
export const AIConversionResponseSchema = z.object({
  title: z.string(),
  statement: z.string(),
  solution: z.string(),
  category: CategorySchema,
  confidenceScore: z.number().min(0).max(1),
  message: z.string().default("AI conversion completed successfully")
});

// Exercise statistics schema
export const ExerciseStatsSchema = z.object({
  total_exercises: z.number(),
  category_distribution: z.record(z.string(), z.number())
});

// API Error response schema
export const APIErrorSchema = z.object({
  detail: z.string(),
  status_code: z.number().optional()
});

// TypeScript types derived from schemas
export type Category = z.infer<typeof CategorySchema>;
export type ExerciseBase = z.infer<typeof ExerciseBaseSchema>;
export type ExerciseCreate = z.infer<typeof ExerciseCreateSchema>;
export type ExerciseUpdate = z.infer<typeof ExerciseUpdateSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type ExerciseList = z.infer<typeof ExerciseListSchema>;
export type AIConversionResponse = z.infer<typeof AIConversionResponseSchema>;
export type ExerciseStats = z.infer<typeof ExerciseStatsSchema>;
export type APIError = z.infer<typeof APIErrorSchema>;

// Query parameters for exercises endpoint
export const ExerciseQuerySchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional()
});

export type ExerciseQuery = z.infer<typeof ExerciseQuerySchema>; 