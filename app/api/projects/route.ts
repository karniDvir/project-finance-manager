import { ProjectService } from "@/lib/services/projectService";
import { catchAsync } from "@/utils/catchAsync";
import { withAuth } from "@/utils/withAuth";

// GET /api/projects
export const GET = catchAsync(
  withAuth(async(req, userId) => {
  return ProjectService.list(req, userId);
}));

// POST /api/projects
export const POST = catchAsync(
  withAuth(async(req, userId) => {
  return ProjectService.create(req, userId);
}));
