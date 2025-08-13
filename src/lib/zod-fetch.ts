import { z } from "zod";

export interface ZodFetchParams<TRawResponse, TSchema extends z.ZodType>
  extends RequestInit {
  extractResponseData?: (data: TRawResponse) => z.infer<TSchema>;
  schema: TSchema;
}

export async function zodFetch<
  TRawResponse = unknown,
  TSchema extends z.ZodType = z.ZodType
>(
  url: string,
  {
    extractResponseData,
    schema,
    ...init
  }: ZodFetchParams<TRawResponse, TSchema>
): Promise<z.infer<TSchema>> {
  try {
    const response = await fetch(url, init);

    if (!response.ok) {
      throw new Error(`Http error: ${response.status} ${response.body}`);
    }

    const raw = await response.json();
    return schema.parse(extractResponseData ? extractResponseData(raw) : raw);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      throw new Error(`Zod error: ${error.message}`);
    }

    throw error;
  }
}
