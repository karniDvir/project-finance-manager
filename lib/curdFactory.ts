import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { AppError } from "@/utils/AppError";
import { z } from "zod";
import { buildQuery } from "@/utils/queryBuilder";

type PrismaModel = keyof typeof prisma;

export function createCrudHandlers<T extends z.ZodObject<any>>(
  model: PrismaModel,
  schema: T,
  requireProjectId: boolean = false
) {
  return {
    async list(req: Request, projectId?: string) {
      const userId = await getUserId();
      const { searchParams } = new URL(req.url);
      const query = Object.fromEntries(searchParams.entries());

      const { where: filters, orderBy } = buildQuery(query);

      const where: any = { userId, ...filters };
      if (requireProjectId) {
        if (!projectId) throw new AppError("projectId is required", 400);
        where.projectId = projectId;
      }

      return (prisma[model] as any).findMany({ where, orderBy });
    },

    async create(req: Request, projectId?: string) {
      const userId = await getUserId();
      const body = await req.json();
      const data = schema.parse(requireProjectId ? { ...body, projectId } : body);

      return (prisma[model] as any).create({
        data: { ...data, userId },
      });
    },

    async getById(id: string, projectId?: string) {
      const userId = await getUserId();
      const where: any = { id, userId };
      if (requireProjectId) {
        if (!projectId) throw new AppError("projectId is required", 400);
        where.projectId = projectId;
      }

      const item = await (prisma[model] as any).findFirst({ where });
      if (!item) throw new AppError("Not found", 404);
      return item;
    },

    async update(id: string, req: Request, projectId?: string) {
      const userId = await getUserId();
      const body = await req.json();
      const data = (schema.partial() as any).parse(
        requireProjectId ? { ...body, projectId } : body
      );

      const where: any = { id, userId };
      if (requireProjectId) {
        if (!projectId) throw new AppError("projectId is required", 400);
        where.projectId = projectId;
      }

      try {
        return await (prisma[model] as any).update({ where, data });
      } catch (err: any) {
        if (err.code === "P2025") throw new AppError("Record not found", 404);
        throw err;
      }
    },

    async remove(id: string, projectId?: string) {
      const userId = await getUserId();
      const where: any = { id, userId };
      if (requireProjectId) {
        if (!projectId) throw new AppError("projectId is required", 400);
        where.projectId = projectId;
      }

      try {
        await (prisma[model] as any).delete({ where });
      } catch (err: any) {
        if (err.code === "P2025") throw new AppError("Record not found", 404);
        throw err;
      }
      return { success: true };
    },
  };
}
