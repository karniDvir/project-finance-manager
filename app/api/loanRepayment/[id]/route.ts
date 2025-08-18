import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { catchAsync } from "@/utils/catchAsync";
import { AppError } from "@/utils/AppError";
import { getUserId } from "@/lib/auth";
import { idSchema } from "@/lib/validation";

export const GET = catchAsync(async (_req: NextRequest, ctx) => {
  const userId = await getUserId();
  const { id } = idSchema.parse(ctx.params);
  const repayment = await prisma.loanRepayment.findFirst({
    where: { id, userId },
    include: { loan: true },
  });

  if (!repayment) throw new AppError("Loan repayment not found", 404);
  return NextResponse.json(repayment);
});

export const PATCH = catchAsync(async (_req: NextRequest, ctx)  => {
  const userId = await getUserId();
  const { amount } = await _req.json();
  const { id } = idSchema.parse(ctx.params);
  const updated = await prisma.loanRepayment.update({
    where: { id, userId },
    data: { ...(amount !== undefined && { amount }) },
  });

  if (!updated) throw new AppError("Loan repayment not found", 404);
  return NextResponse.json({ message: "Updated" });
});

export const DELETE = catchAsync(async (_req: NextRequest, ctx)  => {
  const userId = await getUserId();
  const { id } = idSchema.parse(ctx.params);
  const deleted = await prisma.loanRepayment.delete({
    where: { id, userId },
  });

  if (!deleted) throw new AppError("Loan repayment not found", 404);
  return NextResponse.json({ message: "Deleted" });
});
