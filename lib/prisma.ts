import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // optional: remove if logs are too noisy
  });

// Prevent multiple instances in dev (Next.js hot reload issue)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
