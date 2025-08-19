// services/projectDashboardService.ts
import { prisma } from "@/lib/prisma";

export const ProjectDashboardService = {
  async getDashboard(projectId: string, userId: string) {
    // Step 1: Load all payments for this project
    const payments = await prisma.payment.findMany({
      where: { projectId, userId },
      include: { beneficiary: true },
    });

    // Step 2: Compute totals
    const income = sum(payments.filter(p => p.kind === "INCOME").map(p => p.amount));
    const expense = sum(payments.filter(p => p.kind === "EXPENSE").map(p => p.amount));
    const repayment = sum(payments.filter(p => p.kind === "REPAYMENT").map(p => p.amount));
    const netBalance = income - expense;

    // Step 3: Loan stats
    const totalBorrowed = sum(payments.filter(p => p.kind === "INCOME" && p.source === "LOAN").map(p => p.amount));
    const totalRepaid = repayment;
    const outstanding = totalBorrowed - totalRepaid;
    const repaymentCoverage = totalBorrowed > 0 ? (totalRepaid / totalBorrowed) * 100 : 0;

    // Step 4: Beneficiary totals
    const beneficiaries: Record<string, number> = {};
    payments
      .filter(p => p.kind === "EXPENSE" && p.beneficiaryId)
      .forEach(p => {
        beneficiaries[p.beneficiary?.name || p.beneficiaryId!] =
          (beneficiaries[p.beneficiary?.name || p.beneficiaryId!] || 0) + p.amount;
      });

    // Step 5: Monthly trends
    const trends: Record<string, { income: number; expense: number }> = {};
    payments.forEach(p => {
      const month = p.date.toISOString().slice(0, 7); // e.g. "2025-08"
      if (!trends[month]) trends[month] = { income: 0, expense: 0 };
      if (p.kind === "INCOME") trends[month].income += p.amount;
      if (p.kind === "EXPENSE") trends[month].expense += p.amount;
    });
    const monthlyTrends = Object.entries(trends).map(([month, vals]) => ({
      month,
      income: vals.income,
      expense: vals.expense,
      net: vals.income - vals.expense,
    }));

    // Step 6: Breakdown by source
    const bySource: Record<string, number> = { LOAN: 0, BALANCE: 0, INVESTMENT: 0 };
    payments.forEach(p => {
      bySource[p.source] = (bySource[p.source] || 0) + p.amount;
    });

    // Step 7: Insights
    const monthsCount = new Set(monthlyTrends.map(t => t.month)).size || 1;
    const burnRate = expense / monthsCount; // avg monthly expense
    const runwayMonths = burnRate > 0 ? Math.floor(netBalance / burnRate) : Infinity;

    const topExpense = payments.filter(p => p.kind === "EXPENSE").sort((a, b) => b.amount - a.amount)[0];
    const topIncome = payments.filter(p => p.kind === "INCOME").sort((a, b) => b.amount - a.amount)[0];

    // Step 8: Recent activity
    const recentActivity = payments
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        date: p.date,
        amount: p.amount,
        kind: p.kind,
      }));

    // Step 9: Return response
    return {
      totals: { income, expense, netBalance },
      loans: { totalBorrowed, totalRepaid, outstanding, repaymentCoverage },
      beneficiaries: Object.entries(beneficiaries).map(([name, totalExpense]) => ({
        name,
        totalExpense,
      })),
      monthlyTrends,
      breakdown: { bySource, byBeneficiary: beneficiaries },
      insights: { burnRate, runwayMonths, topExpense, topIncome },
      recentActivity,
    };
  },
};

// helper
function sum(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0);
}
