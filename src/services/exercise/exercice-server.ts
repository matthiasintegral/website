"server only";

import { env } from "@/config/env";
import { zodFetch } from "@/lib/zod-fetch";
import {
  AIConversionExerciseResponseSchema,
  type AIConversionExerciseResponseDTO,
} from "./dto";

export async function aiConversionExercise(
  formData: FormData
): Promise<AIConversionExerciseResponseDTO> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180_000); // 3 min
  try {
    return await zodFetch(
      `${env.NEXT_PUBLIC_API_BASE_URL}/api/exercises/ai-conversion`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
        schema: AIConversionExerciseResponseSchema,
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
