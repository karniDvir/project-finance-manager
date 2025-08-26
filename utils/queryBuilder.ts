// utils/queryBuilder.ts
import { querySchema } from "@/lib/validation";

export function buildQuery(
  query: any,
  model: "user" | "project" | "beneficiary" | "payment" | "loan" | "attachment"
) {
  const parsed = querySchema.parse(query);

  const where: any = {};

  if (parsed.name) {
    where.name = { contains: parsed.name, mode: "insensitive" };
  }

  if (parsed.minAmount || parsed.maxAmount) {
    where.amount = {};
    if (parsed.minAmount) where.amount.gte = parsed.minAmount;
    if (parsed.maxAmount) where.amount.lte = parsed.maxAmount;
  }
  if (model === "loan" && parsed.type) {
    where.type = parsed.type;
  }

  // map "date" → real DB field depending on model
  const sortMap: Record<string, string> = {
    user: "createdAt",
    project: "createdAt",
    beneficiary: "createdAt",
    payment: "date",
    loan: "date",
  };

  const field = parsed.sortBy === "date" ? sortMap[model] : parsed.sortBy;
  const orderBy = { [field]: parsed.sort };

  return { where, orderBy };
}
