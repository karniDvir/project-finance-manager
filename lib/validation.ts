import { z } from "zod";

export const idSchema = z.object({
  id: z.string().cuid("Invalid id format"),
});

export const projectIdField = z.string().cuid("Invalid project ID");

// 🔹 User
export const userSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
});

// 🔹 Project
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  userId: z.string().cuid(),
});

// 🔹 Beneficiary
export const beneficiarySchema = z.object({
  name: z.string().min(1, "Beneficiary name is required"),
  reason: z.string().optional(),
  userId: z.string().cuid(),
  projectId: projectIdField
});

// 🔹 Enums (לפי Prisma)
export const paymentMethodSchema = z.enum(["CASH", "TRANSACTION", "CREDIT"]);
export const paymentSourceSchema = z.enum([
  "LOAN",
  "BALANCE",
  "INVESTMENT",
  "PERSONAL",
]);
export const paymentKindSchema = z.enum(["INCOME", "EXPENSE", "REPAYMENT"]);

// 🔹 PaymentType
export const paymentTypeSchema = z.object({
  method: paymentMethodSchema,
  source: paymentSourceSchema,
});

// 🔹 Payment
export const paymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  kind: paymentKindSchema,
  date: z.string().datetime().optional(),         // תאריך פעולה (נוצר אוטומטי אם לא נשלח)
  effectiveDate: z.string().datetime().optional(), // תאריך ידני
  notes: z.string().optional(),
  receipt: z.string().optional(),

  beneficiaryId: z.string().cuid().optional(),
  userId: z.string().cuid(),
  projectId: projectIdField,
  paymentTypeId: z.string().cuid(),
  loanId: z.string().cuid().optional(),
});

// 🔹 Loan
export const loanSchema = z.object({
  name: z.string().min(1, "Loan name is required"),
  amount: z.number().positive("Loan amount must be positive"),
  date: z.string().datetime().optional(),
  notes: z.string().optional(),
  userId: z.string().cuid(),
  projectId: projectIdField,
});

// 🔹 Attachment
export const attachmentSchema = z.object({
  url: z.string().url("Invalid URL"),
  entityId: z.string().cuid(),
  uploadedAt: z.string().datetime().optional(),
  paymentId: z.string().cuid().optional(),
});

// 🔹 Query params (לסינון)
export const querySchema = z.object({
  minAmount: z.coerce.number().positive().optional(),
  maxAmount: z.coerce.number().positive().optional(),
  name: z.string().optional(),
  sortBy: z.enum(["date", "amount"]).default("date"),
  sort: z.enum(["asc", "desc"]).default("desc"),
});