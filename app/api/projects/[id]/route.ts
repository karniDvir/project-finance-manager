import { ProjectService } from "@/lib/services/projectService";
import { catchAsync } from "@/utils/catchAsync";
import { getUserId } from "@/lib/auth";

// GET /api/projects/[id]
export const GET = catchAsync(async (req, { params }) => {
  const userId = await getUserId();
  return ProjectService.getById(params.id, userId);
});

// PUT /api/projects/[id]
export const PUT = catchAsync(async (req, { params }) => {
  const userId = await getUserId();
  return ProjectService.update(params.id, req, userId);
});

// DELETE /api/projects/[id]
export const DELETE = catchAsync(async (req, { params }) => {
  const userId = await getUserId();
  return ProjectService.remove(params.id, userId);
});
