import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import type { ApiResponse } from "@/types";

export function successResponse<T>(data: T, meta?: ApiResponse["meta"], message?: string) {
  return NextResponse.json({ success: true, data, meta, message } satisfies ApiResponse<T>);
}

export function errorResponse(error: string, status: number = 400) {
  return NextResponse.json({ success: false, error } satisfies ApiResponse, { status });
}

/** Log the real error server-side and return a generic 500 so internals are not leaked to clients. */
export function serverErrorResponse(context: string, error: unknown) {
  console.error(`[${context}]`, error);
  return errorResponse("Terjadi kesalahan pada server. Silakan coba lagi.", 500);
}

export function parseBody<T>(schema: ZodSchema<T>, data: unknown): { data: T } | { error: NextResponse } {
  try {
    return { data: schema.parse(data) };
  } catch (err) {
    if (err instanceof ZodError) {
      const issues = err.issues || (err as any).errors || [];
      const message = issues.map((e: any) => `${e.path?.join(".") || "field"}: ${e.message}`).join("; ");
      return { error: errorResponse(message, 422) };
    }
    return { error: errorResponse("Invalid request body", 400) };
  }
}

export function parseSearchParams<T>(schema: ZodSchema<T>, params: URLSearchParams): { data: T } | { error: NextResponse } {
  const obj = Object.fromEntries(params.entries());
  return parseBody(schema, obj);
}
