import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { catchAsync } from "@/utils/catchAsync";
import { AppError } from "@/utils/AppError";
import { getUserId } from "@/lib/getUserId";

// GET: /api/loan-repayments?loanId=xxx
export const GET = catchAsync(async (req: NextRequest) => {
  const userId = await getUserId();
  const { searchParams } = new URL(req.url);
  const loanId = searchParams.get("loanId");
  const repayments = await prisma.loanRepayment.findMany({
    where: {
      userId,
      ...(loanId && { loanId }),
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(repayments);
});

// POST: /api/loan-repayments
export const POST = catchAsync(async (req: NextRequest) => {
  const userId = await getUserId();
  const { amount, loanId } = await req.json();

  if (!amount || !loanId) throw new AppError("Amount and loanId are required", 400);

  const repayment = await prisma.loanRepayment.create({
    data: { userId, loanId, amount },
  });


  return NextResponse.json(repayment, { status: 201 });
});
