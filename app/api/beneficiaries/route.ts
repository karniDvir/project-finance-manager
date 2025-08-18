// app/api/beneficiaries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';
import { getServerSession } from 'next-auth';
import { getUserId } from '@/lib/getUserId';

// GET: /api/beneficiaries?minTotal=100&sortBy=totalAmount&sort=asc&startDate=2024-01-01&endDate=2024-12-31
export const GET = catchAsync(async (req: NextRequest, res : NextResponse ) => {
  const userId = await getUserId();
  const { searchParams } = new URL(req.url);

  const minTotal = searchParams.get('minTotal')
    ? parseFloat(searchParams.get('minTotal')!)
    : undefined;

  const sort = searchParams.get('sort') === 'desc' ? 'desc' : 'asc';
  const sortBy = searchParams.get('sortBy') || 'createdAt';

  const startDate = searchParams.get('startDate')
    ? new Date(searchParams.get('startDate')!)
    : undefined;

  const endDate = searchParams.get('endDate')
    ? new Date(searchParams.get('endDate')!)
    : undefined;

  const beneficiaries = await prisma.beneficiaryWithAmounts.findMany({
    where: {
      userId,
      ...(minTotal !== undefined && { totalAmount: { gt: minTotal } }),
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
    },
    orderBy: {
      [sortBy]: sort,
    },
  });

  return NextResponse.json(beneficiaries);
});

// POST: /api/beneficiaries
export const POST = catchAsync(async (req: NextRequest) => {
  //get userId from the se
  const userId = await getUserId();
  const { name, reason, totalAmount } = await req.json();
  if (!name || !reason) {
    throw new AppError('Name and reason are required', 400);
  }
  
  const beneficiary = await prisma.beneficiary.create({
    data: {
      userId,
      name,
      reason,
      totalAmount: totalAmount ? parseFloat(totalAmount) : 0,
    },
  }); 

  return NextResponse.json(beneficiary, { status: 201 });
});
