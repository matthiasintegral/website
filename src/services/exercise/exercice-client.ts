"use client";

import { env } from "@/config/env";
import { zodFetch } from "@/lib/zod-fetch";
import {
  FindAllExerciseCategoryResponseSchema,
  type FindAllExerciseCategoryResponseDTO,
} from "./dto";

export async function findAllExerciseCategory(): Promise<FindAllExerciseCategoryResponseDTO> {
  return await zodFetch(
    `${env.NEXT_PUBLIC_API_BASE_URL}/api/exercises/categories`,
    {
      schema: FindAllExerciseCategoryResponseSchema,
    }
  );
}
