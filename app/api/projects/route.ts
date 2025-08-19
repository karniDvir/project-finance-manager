import { ProjectService } from "@/lib/services/projectService";
import { catchAsync } from "@/utils/catchAsync";
import { getUserId } from "@/lib/auth";

// GET /api/projects
export const GET = catchAsync(async (req) => {
  return ProjectService.list(req);
});

// POST /api/projects
export const POST = catchAsync(async (req) => {
  return ProjectService.create(req);
});
