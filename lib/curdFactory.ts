import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { AppError } from "@/utils/AppError";

type PrismaModel = keyof typeof prisma;

export function createCrudHandlers<T extends z.ZodObject<any>>(
  model: PrismaModel,
  schema: T
) {
  return {
    async list(where: object = {}, orderBy: object = { date: "desc" }) {
      const userId = await getUserId();
      return (prisma[model] as any).findMany({
        where: { userId, ...where },
        orderBy,
      });
    },

    async create(req: Request) {
      const userId = await getUserId();
      const body = await req.json();
      const data = schema.parse(body);
      return (prisma[model] as any).create({
        data: { ...data, userId },
      });
    },

    async getById(id: string) {
      const userId = await getUserId();
      const item = await (prisma[model] as any).findFirst({
        where: { id, userId },
      });
      if (!item) throw new AppError("Not found", 404);
      return item;
    },

    async update(id: string, req: Request) {
      const userId = await getUserId();
      const body = await req.json();
      const data = (schema.partial() as any).parse(body);
      try {
        return await (prisma[model] as any).update({
          where: { id, userId },
          data,
        });
      } catch (err: any) {
        if (err.code === "P2025") throw new AppError("Record not found", 404);
        throw err;
      }
    },

    async remove(id: string) {
      const userId = await getUserId();
      try {
        await (prisma[model] as any).delete({
          where: { id, userId },
        });
      } catch (err: any) {
        if (err.code === "P2025") throw new AppError("Record not found", 404);
        throw err;
      }
      return { success: true };
    },
  };
}
