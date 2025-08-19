import { createCrudHandlers } from "@/lib/curdFactory";
import { loanSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

const base = createCrudHandlers("loan", loanSchema, true);

export const LoanService = {
  ...base,

  // Custom: list loans with remaining balance
  async getLoansWithBalance(projectId: string, userId: string) {
    const loans = await prisma.loan.findMany({
      where: { projectId, userId },
      include: { payments: true },
    });

    return loans.map(l => {
      const returned = l.payments.filter(p => p.kind === "REPAYMENT")
        .reduce((s, p) => s + p.amount, 0);
      return { ...l, returned, remaining: l.amount - returned };
    });
  },
};
