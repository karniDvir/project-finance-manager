import { prisma } from "@/lib/prisma";
import { incomeSchema } from "@/lib/validation";
import { catchAsync } from "@/utils/catchAsync";
import { withProjectAuth } from "@/utils/withProjectAuth";

// GET /api/projects/[id]/income
export const GET = catchAsync(
  withProjectAuth(async (req: Request, userId: string, context: any, projectId: string) => {
    const incomes = await prisma.payment.findMany({
      where: {
        projectId,
        userId,
        kind: "INCOME",
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        amount: true,
        source: true,
        date: true,
        effectiveDate: true,
        notes: true,
        receipt: true,
      },
    });

    // Transform the data to match our income interface
    const transformedIncomes = incomes.map((income) => ({
      id: income.id,
      type: income.source, // Map source to type
      amount: income.amount,
      from: income.receipt, // Using receipt field to store "from" info
      details: income.notes,
      incomeDate: income.effectiveDate || income.date,
      actionDate: income.date,
    }));

    return Response.json(transformedIncomes);
  })
);

// POST /api/projects/[id]/income
export const POST = catchAsync(
  withProjectAuth(async (req: Request, userId: string, context: any, projectId: string) => {
    const body = await req.json();
    
    // Validate the income data
    const validatedData = incomeSchema.parse({
      ...body,
      projectId,
      userId,
    });

    // Map income type to payment source
    const sourceMapping = {
      PERSONAL: "BALANCE",
      LOAN: "LOAN", 
      INVESTMENT: "INVESTMENT",
    } as const;

    // Create the income as a payment record
    const income = await prisma.payment.create({
      data: {
        amount: validatedData.amount,
        kind: "INCOME",
        source: sourceMapping[validatedData.type],
        date: new Date(), // action date (auto-generated)
        effectiveDate: new Date(validatedData.incomeDate),
        notes: validatedData.details,
        receipt: validatedData.from, // Store "from" in receipt field
        userId,
        projectId,
      },
      select: {
        id: true,
        amount: true,
        source: true,
        date: true,
        effectiveDate: true,
        notes: true,
        receipt: true,
      },
    });

    // Transform the response to match our income interface
    const transformedIncome = {
      id: income.id,
      type: validatedData.type,
      amount: income.amount,
      from: income.receipt,
      details: income.notes,
      incomeDate: income.effectiveDate,
      actionDate: income.date,
    };

    return Response.json(transformedIncome, { status: 201 });
  })
);
