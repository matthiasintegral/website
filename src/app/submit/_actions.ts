"use server";

import {
  type AIConversionExerciseResponseDTO,
  aiConversionExercise,
} from "@/services/exercise";

export type AIConversionActionState =
  | { ok: true; data: AIConversionExerciseResponseDTO }
  | { ok: false; error: string };

export async function aiConversionAction(
  _prevState: AIConversionActionState | null,
  formData: FormData
): Promise<AIConversionActionState> {
  try {
    const data = await aiConversionExercise(formData);
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
