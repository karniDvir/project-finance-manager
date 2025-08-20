import { createCrudHandlers } from "@/lib/curdFactory";
import { userSchema } from "@/lib/validation";
import { prisma } from '@/lib/prisma';
const base = createCrudHandlers("user", userSchema, false);

export const UserService = {
  ...base,

  async getMe(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { projects: true },
    });
  },
};
