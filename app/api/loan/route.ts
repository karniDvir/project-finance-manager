import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { catchAsync } from "@/utils/catchAsync";
import { AppError } from "@/utils/AppError";
import { getUserId } from "@/lib/getUserId";

// GET: /api/loans
export const GET = catchAsync(async () => {
  const userId = await getUserId();
  const loans = await prisma.loanWithReturned.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(loans);
});

// POST: /api/loans
export const POST = catchAsync(async (req: NextRequest) => {
  const userId = await getUserId();
  const { name, amount } = await req.json();
  console.log(name, amount)
  if (!name || !amount) throw new AppError("Name and amount are required", 400);

  const loan = await prisma.loan.create({
    data: { name, amount, userId },
  });

  return NextResponse.json(loan, { status: 201 });
});
