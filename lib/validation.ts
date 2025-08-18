import { z } from "zod";

export const idSchema = z.object({
  id: z.string().cuid("Invalid id format"),
});

export const loanSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().datetime().optional(),
});

export const loanRepaymentSchema = z.object({
  amount: z.number().positive(),
  date: z.string().datetime().optional(),
});

export const beneficiarySchema = z.object({
  name: z.string().min(1),
  reason: z.string().min(1),
  totalAmount: z.number().positive().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().positive(),
  date: z.string().datetime().optional(),
  beneficiaryId: z.string().cuid(),
  paymentTypeId: z.string().cuid(),
});

export const querySchema = z.object({
  minAmount: z.string().transform(Number).optional(),
  maxAmount: z.string().transform(Number).optional(),
  name: z.string().optional(),
  sortBy: z.enum(["date", "amount"]).default("date"),
  sort: z.enum(["asc", "desc"]).default("desc"),
});