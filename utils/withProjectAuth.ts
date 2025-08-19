// utils/withProjectAuth.ts
import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/AppError";

// Middleware wrapper to ensure the project belongs to the authenticated user
// The handler always receives: (req, userId, context, projectId)
export function withProjectAuth(
  handler: (req: Request, userId: string, context: any, projectId: string) => Promise<any>
) {
  return async (req: Request, context: any) => {
    const userId = await getUserId();
    const { projectId } = context.params;

    // Ensure the project exists and belongs to this user
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new AppError("Forbidden: Project not found or not yours", 403);
    }

    return handler(req, userId, context, projectId);
  };
}
