import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { catchAsync } from "@/utils/catchAsync";
import { AppError } from "@/utils/AppError";
import { getUserId } from "@/lib/auth";

// GET: /api/payments?beneficiaryId=xxx&startDate=2024-01-01&endDate=2024-12-31&sortBy=date&sort=asc
export const GET = catchAsync(async (req: NextRequest) => {
  const userId = await getUserId();
  const { searchParams } = new URL(req.url);

  // optional filters
  const beneficiaryId = searchParams.get("beneficiaryId") || undefined;

  const startDate = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate")!)
    : undefined;

  const endDate = searchParams.get("endDate")
    ? new Date(searchParams.get("endDate")!)
    : undefined;

  // sorting
  const sort = searchParams.get("sort") === "asc" ? "asc" : "desc"; // default desc
  const sortBy = searchParams.get("sortBy") || "date"; // default date

  const payments = await prisma.payment.findMany({
    where: {
      userId,
      ...(beneficiaryId && { beneficiaryId }),
      ...(startDate &&
        endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }),
    },
    include: {
      beneficiary: true,
      paymentType: true,
    },
    orderBy: {
      [sortBy]: sort, // date | amount
    },
  });

  return NextResponse.json(payments);
});

// POST: /api/payments
export const POST = catchAsync(async (req: NextRequest) => {
  const userId = await getUserId();
  const { amount, beneficiaryId, paymentTypeId, receipt } = await req.json();

  if (!amount || !beneficiaryId || !paymentTypeId) {
    throw new AppError("Missing required fields", 400);
  }

  const payment = await prisma.payment.create({
    data: {
      userId,
      amount,
      beneficiaryId,
      paymentTypeId,
      receipt,
    },
  });

  return NextResponse.json(payment, { status: 201 });
});
