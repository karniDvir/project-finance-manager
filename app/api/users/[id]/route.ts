import { catchAsync } from "@/utils/catchAsync";
import { prisma } from "@/lib/prisma";
import { withAuthAdmin } from "@/utils/withAuthAdmin";
import { AppError } from "@/utils/AppError";
import { userSchema } from "@/lib/validation";

// GET /api/users/:id
export const GET = catchAsync(
  withAuthAdmin(async (req, context) => {
    const { id } = context.params;
    if (!id) throw new AppError("User ID is required", 400);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError("User not found", 404);

    return user;
  })
);

// PUT /api/users/:id
export const PUT = catchAsync(
  withAuthAdmin(async (req, context) => {
    const { id } = context.params;
    if (!id) throw new AppError("User ID is required", 400);

    const body = await req.json();
    const { role } = body;

    if (role !== "ADMIN" && role !== "USER") {
      throw new AppError("Invalid role. Must be ADMIN or USER", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return updatedUser;
  })
);
// DELETE /api/users/:id
export const DELETE = catchAsync(
  withAuthAdmin(async (req, context) => {
    const { id } = context.params;
    if (!id) throw new AppError("User ID is required", 400);

    try {
      return await prisma.user.delete({ where: { id } });
    } catch (err: any) {
      if (err.code === "P2025") throw new AppError("User not found", 404);
      throw err;
    }
  })
);
