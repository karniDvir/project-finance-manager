import { createCrudHandlers } from "@/lib/curdFactory";
import { loanSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { LoanType } from "@prisma/client";

const base = createCrudHandlers("loan", loanSchema, true);

export const LoanService = {
  ...base,
async getLoansWithBalance(req: Request, projectId: string, userId: string) {
  const where: { projectId: string; userId: string;} = {
    projectId,
    userId,
  };

  return prisma.loan.findMany({
    where,
    // include: {
    //   paymentsAsSource: true,
    //   paymentsAsTarget: true,
    // },
  });
}

};
