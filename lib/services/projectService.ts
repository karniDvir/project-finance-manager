import { createCrudHandlers } from "@/lib/curdFactory";
import { projectSchema, idSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";

const base = createCrudHandlers("project", projectSchema, false);

export const ProjectService = {
  ...base,
};
