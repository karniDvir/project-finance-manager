import { createCrudHandlers } from "@/lib/curdFactory";
import { incomeSchema, expenseSchema, repaymentSchema, basePaymentSchema } from "@/lib/paymentValidation";
import { buildQuery } from "@/utils/queryBuilder";
import { prisma } from "@/lib/prisma";

const base = createCrudHandlers("payment", basePaymentSchema, true);

export const PaymentService = {
  ...base,

  //json with source = LOAN // INVESMENT must have loanSourceId 
  async createPayment(req: Request, userId: string, projectId: string) {
    const body = await req.json();
    const data = validatePaymentByKind({ ...body, projectId });

    return prisma.payment.create({
      data: { userId, projectId, ...data },
    });
  },

  async updatePayment(req: Request, userId: string, projectId: string, paymentId: string) {
    const body = await req.json();
    const data = validatePaymentByKind({ ...body, projectId });

    return prisma.payment.update({
      where: { id: paymentId, userId, projectId },
      data,
    });
  },

  //relation is from the api, relationId is from the [id]
  async listByRelation(req: Request, userId: string, projectId: string, relation: "beneficiaryId" | "loanSourceId" | "loanTargetId", relationId: string) {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    const { where: filters, orderBy } = buildQuery(query);

    return prisma.payment.findMany({
      where: { userId, projectId, [relation]: relationId, ...filters },
      orderBy,
    });
  },

  //sourse id from request body, target is from the query
  async createForRelation(req: Request, userId: string, projectId: string, relation: "beneficiaryId" | "loanSourceId" | "loanTargetId", relationId: string) {
    const body = await req.json();
    const data = validatePaymentByKind({ ...body, projectId, [relation]: relationId });

    return prisma.payment.create({
      data: { userId, projectId, ...data },
    });
  },
};

// Helper
function validatePaymentByKind(data: any) {
  switch (data.kind) {
    case "INCOME":
      return incomeSchema.parse(data);
    case "EXPENSE":
      return expenseSchema.parse(data);
    case "REPAYMENT":
      return repaymentSchema.parse(data);
    default:
      return basePaymentSchema.parse(data);
  }
}
