// src/lib/catchAsync.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./AppError";

export function catchAsync(handler: (...args: any[]) => Promise<any>) {
  return async (...args: any[]) => {
    try {
      const result = await handler(...args);
      return NextResponse.json(result);
    } catch (err: any) {
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: err},
          { status: 400 }
        );
      }

      if (err instanceof AppError) {
        return NextResponse.json(
          { error: err.message },
          { status: err.statusCode }
        );
      }

      console.error("Unexpected error:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
