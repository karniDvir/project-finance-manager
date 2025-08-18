import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { catchAsync } from "@/utils/catchAsync";
import { AppError } from "@/utils/AppError";
import { getUserId } from "@/lib/auth";
import { idSchema } from "@/lib/validation";

export const GET = catchAsync(async (_req: NextRequest, ctx) => {
  const userId = await getUserId();
  const { id } = idSchema.parse(ctx.params);
  const loan = await prisma.loanWithReturned.findFirst({
    where: { id, userId },
  });
  if (!loan) throw new AppError("Loan not found", 404);
  return NextResponse.json(loan);
});

export const PATCH = catchAsync(async (_req: NextRequest, ctx) => {
  const userId = await getUserId();
  const { name, amount } = await _req.json();
  const { id } = idSchema.parse(ctx.params);
  const updated = await prisma.loan.update({
    where: { id, userId },
    data: {
      ...(name && { name }),
      ...(amount !== undefined && { amount }),
    },
  });

  if (!updated) throw new AppError("Loan not found", 404);
  return NextResponse.json({ message: "Updated" });
});

export const DELETE = catchAsync(async (_req: NextRequest, ctx) =>  {
  const userId = await getUserId();
  const { id } = idSchema.parse(ctx.params);
  const deleted = await prisma.loan.delete({
    where: { id , userId },
  });

  if (!deleted) throw new AppError("Loan not found", 404);
  return NextResponse.json({ message: "Deleted" });
});
