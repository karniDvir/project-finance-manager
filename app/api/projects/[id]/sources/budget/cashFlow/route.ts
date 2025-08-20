// GET /api/projects/:projectId/sources/budget/cashFlow
import { catchAsync } from "@/utils/catchAsync";
import { withProjectAuth } from "@/utils/withProjectAuth";
import { SourceFlowService } from "@/lib/services/sourseFlowService";

export const GET_BUDGET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return SourceFlowService.getPaymentsFromSource(projectId, userId, {
      type: "budget",
    });
  })
);