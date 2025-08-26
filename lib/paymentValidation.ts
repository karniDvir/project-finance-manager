// lib/paymentValidation.ts
import { z } from "zod";

export const basePaymentSchema = z.object({
  amount: z.number().positive(),
  kind: z.enum(["INCOME", "EXPENSE", "REPAYMENT"]),
  source: z.enum(["LOAN", "BALANCE", "INVESTMENT"]),
  beneficiaryId: z.string().cuid().optional(),
  loanSourceId: z.string().cuid().optional(),
  loanTargetId: z.string().cuid().optional(),
});
//request with source = LOAN // INVESMENT must have body.loanSourceId 

// EXPENSE
export const expenseSchema = basePaymentSchema.extend({
  kind: z.literal("EXPENSE"),
  beneficiaryId: z.string().cuid(),
}).superRefine((data, ctx) => {
  if ((data.source === "LOAN" || data.source === "INVESTMENT") && !data.loanSourceId) {
    ctx.addIssue({
      path: ["loanSourceId"],
      message: "loanSourceId is required when source = LOAN/INVESTMENT for EXPENSE",
      code: "custom",
    });
  }
});

// INCOME
export const incomeSchema = basePaymentSchema.extend({
  kind: z.literal("INCOME"),
}).superRefine((data, ctx) => {
  if ((data.source === "LOAN" || data.source === "INVESTMENT") && !data.loanSourceId) {
    ctx.addIssue({
      path: ["loanSourceId"],
      message: "loanSourceId is required when source = LOAN/INVESTMENT for INCOME",
      code: "custom",
    });
  }
});

// REPAYMENT
export const repaymentSchema = basePaymentSchema.extend({
  kind: z.literal("REPAYMENT"),
  loanTargetId: z.string().cuid(),
}).superRefine((data, ctx) => {
  if (data.source !== "BALANCE") {
    ctx.addIssue({
      path: ["source"],
      message: "REPAYMENT must come from BALANCE",
      code: "custom",
    });
  }
});
