// app/api/beneficiaries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';
import { getUserId } from '@/lib/auth';
import { idSchema } from '@/lib/validation';

export const GET = catchAsync(async (_req: NextRequest, ctx) => {
  const { id } = idSchema.parse(ctx.params);
  const userId = await getUserId();
  const beneficiary = await prisma.beneficiaryWithAmounts.findFirst({
    where:{
        id,
        userId}
  });
  if (!beneficiary) {
    throw new AppError('Beneficiary not found', 404);
  }
  return NextResponse.json(beneficiary)
});

export const PATCH = catchAsync(async (req: NextRequest, ctx) =>{
    const { id } = idSchema.parse(ctx.params);
    const userId = await getUserId();
    const body = await req.json();
    const {name, reason, totalAmount} = body;
    const beneficiary = await prisma.beneficiary.update({
        where: {userId, id},
        data: {
          userId,
         ...(name && {name}),
         ...(reason && { reason }),
         ...(totalAmount !== undefined && { totalAmount: parseFloat(totalAmount) }),
    }
    })
    return NextResponse.json(beneficiary);
});

export const DELETE = catchAsync(async (_req: NextRequest, ctx) => {
  const { id } = idSchema.parse(ctx.params);
  const userId = await getUserId();
  await prisma.beneficiary.delete({
    where: { id , userId},
  });
  return NextResponse.json({ status: 'success', message: 'Beneficiary deleted' });
});