import { createCrudHandlers } from "@/lib/curdFactory";
import { projectSchema, idSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";

const base = createCrudHandlers("project", projectSchema, false);

export const ProjectService = {
  ...base,

  // Custom: dashboard for a project
  async getDashboard(projectId: string, userId: string) {
    const payments = await prisma.payment.findMany({
      where: { projectId, userId },
      include: { paymentType: true },
    });

    const totalIncome = payments.filter(p => p.kind === "INCOME")
      .reduce((s, p) => s + p.amount, 0);

    const totalExpense = payments.filter(p => p.kind === "EXPENSE")
      .reduce((s, p) => s + p.amount, 0);

    const totalRepayments = payments.filter(p => p.kind === "REPAYMENT")
      .reduce((s, p) => s + p.amount, 0);

    const loans = await prisma.loan.findMany({
      where: { projectId, userId },
      include: { payments: true },
    });

    const loansWithRemaining = loans.map(l => {
      const returned = l.payments.filter(p => p.kind === "REPAYMENT")
        .reduce((s, p) => s + p.amount, 0);
      return { ...l, remaining: l.amount - returned };
    });

    return {
      totals: {
        income: totalIncome,
        expense: totalExpense,
        repayments: totalRepayments,
        balance: totalIncome - totalExpense,
      },
      loans: loansWithRemaining,
      payments,
    };
  },
};
