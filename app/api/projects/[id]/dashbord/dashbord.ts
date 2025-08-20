import { catchAsync } from "@/utils/catchAsync";
import { withProjectAuth } from "@/utils/withProjectAuth";
import { ProjectDashboardService } from "@/lib/services/projectDashbordService";

// GET /api/projects/[id]/dashboard
export const GET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return ProjectDashboardService.getDashboard(projectId, userId);
  })
);