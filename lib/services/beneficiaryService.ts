import { createCrudHandlers } from "@/lib/curdFactory";
import { beneficiarySchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

const base = createCrudHandlers("beneficiary", beneficiarySchema, true);

export const BeneficiaryService = {
  ...base,

  // Custom: autocomplete search
  async searchBeneficiaries(userId: string, projectId: string, query: string) {
    return prisma.beneficiary.findMany({
      where: {
        userId,
        projectId,
        name: { contains: query, mode: "insensitive" },
      },
      take: 10,
    });
  },
};
