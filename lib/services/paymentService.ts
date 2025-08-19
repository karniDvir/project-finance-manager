import { createCrudHandlers } from "@/lib/curdFactory";
import { paymentSchema } from "@/lib/validation";
import { AppError } from "@/utils/AppError";

const base = createCrudHandlers("payment", paymentSchema, true);

export const PaymentService = {
  ...base,

  // Custom: enforce repayment rule
  async createPayment(req: Request, projectId: string) {
    const payment = await base.create(req, projectId);

    if (payment.kind === "REPAYMENT" && !payment.loanId) {
      throw new AppError("Repayment must be linked to a loan", 400);
    }

    return payment;
  },
};
