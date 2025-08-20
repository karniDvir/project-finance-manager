import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";
import { z } from "zod";
import { buildQuery } from "@/utils/queryBuilder";

type PrismaModel = "user" | "project" | "beneficiary" | "payment" | "loan" | "attachment";


/**
 * Generic CRUD factory
 * - Authorization (userId + projectId) is already guaranteed by middleware
 * - Services stay clean: only business logic here
 */
export function createCrudHandlers<T extends z.ZodObject<any>>(
  model: PrismaModel,
  schema: T,
  requireProjectId: boolean = false
) {
  return {
    // List items with query filters
    async list(req: Request, userId: string, projectId?: string,) {
      const { searchParams } = new URL(req.url);
      const query = Object.fromEntries(searchParams.entries());

      const { where: filters, orderBy } = buildQuery(query, model);

      const where: any = { userId, ...filters };
      if (requireProjectId) {
        if (!projectId) throw new AppError("projectId is required", 400);
        where.projectId = projectId;
      }

      return (prisma[model] as any).findMany({ where, orderBy });
    },

    // Create item
    async create(req: Request, userId: string, projectId?: string) {
      const body = await req.json();
      delete body.userId;
      delete body.projectId;
      const data = schema.parse(
        requireProjectId ? { ...body, userId, projectId } : {...body, userId}
      );

      return (prisma[model] as any).create({
        data: { ...data, userId },
      });
    },

    // Get by ID
    async getById(id: string, userId: string, projectId?: string) {
      const where: any = { id, userId };
      if (requireProjectId) {
        if (!projectId) throw new AppError("projectId is required", 400);
        where.projectId = projectId;
      }

      const item = await (prisma[model] as any).findFirst({ where });
      if (!item) throw new AppError("Not found", 404);
      return item;
    },

    // Update item
    async update(id: string, req: Request, userId: string, projectId?: string) {
      const body = await req.json();
      delete body.userId;
      delete body.projectId;
      const data = (schema.partial() as any).parse(
        requireProjectId ? { ...body, userId, projectId } : {...body, userId}
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

    // Delete item
    async remove(id: string, userId: string, projectId?: string) {
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
