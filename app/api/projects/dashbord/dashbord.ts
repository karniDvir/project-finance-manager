import { ProjectService } from "@/lib/services/projectService";
import { catchAsync } from "@/utils/catchAsync";
import { getUserId } from "@/lib/auth";

// GET /api/projects/[id]/dashboard
export const GET = catchAsync(async (req, { params }) => {
  const userId = await getUserId();
  return ProjectService.getDashboard(params.id, userId);
});
