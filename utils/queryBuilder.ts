// utils/queryBuilder.ts
import { querySchema } from "@/lib/validation";

export function buildQuery(query: any) {
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

  const orderBy = { [parsed.sortBy]: parsed.sort };

  return { where, orderBy };
}
