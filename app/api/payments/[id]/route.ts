import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { catchAsync } from "@/utils/catchAsync";
import { AppError } from "@/utils/AppError";
import { getUserId } from "@/lib/getUserId";
import { idSchema } from "@/lib/validation";

// GET one payment
export const GET = catchAsync(async (_req: NextRequest, ctx) => {
  const userId = await getUserId();
  const { id } = idSchema.parse(ctx.params);
  const payment = await prisma.payment.findFirst({
    where: { id, userId },
    include: { beneficiary: true, paymentType: true },
  });

  if (!payment) throw new AppError("Payment not found", 404);
  return NextResponse.json(payment);
});

// PATCH update payment
export const PATCH = catchAsync(async (req: NextRequest, ctx) => {
  const userId = await getUserId();
  const { amount, receipt, paymentTypeId } = await req.json();
  const { id } = idSchema.parse(ctx.params);
  const updated = await prisma.payment.update({
    where: { id, userId },
    data: {
      ...(amount !== undefined && { amount }),
      ...(receipt && { receipt }),
      ...(paymentTypeId && { paymentTypeId }),
    },
  });

  if (!updated) throw new AppError("Payment not found", 404);
  return NextResponse.json({ message: "Updated" });
});

// DELETE payment
export const DELETE = catchAsync(async (_req: NextRequest,ctx) => {
  const userId = await getUserId();
  const { id } = idSchema.parse(ctx.params);
  const deleted = await prisma.payment.delete({
    where: { id, userId },
  });

  if (!deleted) throw new AppError("Payment not found", 404);
  return NextResponse.json({ message: "Deleted" });
});
