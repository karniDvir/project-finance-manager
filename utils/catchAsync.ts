import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

type RouteHandler = (req: NextRequest, ctx?: any) => Promise<NextResponse>;

export function catchAsync(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err: any) {
      console.error('API Error:', err);

      let statusCode = err?.statusCode || 500;
      let message = err?.message || 'Something went wrong';

      // Prisma error handling
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          statusCode = 400;
          message = `Duplicate value for field(s): ${err.meta?.target}`;
        }
        if (err.code === 'P2025') {
          statusCode = 404;
          message = 'Record not found';
        }
      }

      return NextResponse.json({ status: 'error', message }, { status: statusCode });
    }
  };
}
