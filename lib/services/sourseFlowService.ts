import { prisma } from "@/lib/prisma";

export const SourceFlowService = {
  async getPaymentsFromSource(
    projectId: string,
    userId: string,
    options: { type: "loan" | "budget"; id?: string }
  ) {
    let where = {};
    where = options.type === "loan"
        ? { projectId, userId, loanSourceId: options.id }
        : { projectId, userId, source: "BALANCE" };

    const payments = await prisma.payment.findMany({
      where,
      include: { beneficiary: true, loanTarget: true },
    });

    const totals = payments.reduce(
      (acc, p) => {
        if (p.kind === "INCOME") acc.incomes += p.amount;
        if (p.kind === "EXPENSE") acc.expenses += p.amount;
        if (p.kind === "REPAYMENT") acc.repayments += p.amount;
        return acc;
      },
      { incomes: 0, expenses: 0, repayments: 0 }
    );

    return { totals, payments };
  },
};
