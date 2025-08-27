// utils/queryBuilder.ts
import { querySchema } from "@/lib/validation";

// utils/queryBuilder.ts
export function buildQuery(query: any, model: "user" | "project" | "beneficiary" | "payment" | "loan" | "attachment") {
  const parsed = querySchema.parse(query);
  const where: any = {};

  if (parsed.name) where.name = { contains: parsed.name, mode: "insensitive" };
  if (parsed.minAmount || parsed.maxAmount) {
    where.amount = {};
    if (parsed.minAmount) where.amount.gte = parsed.minAmount;
    if (parsed.maxAmount) where.amount.lte = parsed.maxAmount;
  }

  if (model === "payment" && parsed.kind) where.kind = parsed.kind;
  if (model === "loan" && parsed.type) where.type = parsed.type;

  const sortMap: Record<string, string> = {
    user: "createdAt",
    project: "createdAt",
    beneficiary: "createdAt",
    payment: "date",
    loan: "date",
    attachment: "createdAt",
  };
  const field = parsed.sortBy ? (parsed.sortBy === "date" ? sortMap[model] : parsed.sortBy) : sortMap[model];
  const orderBy = { [field]: parsed.sort };

  const take = parsed.take ?? undefined;
  const skip = parsed.skip ?? undefined;

  return { where, orderBy, take, skip };
}
