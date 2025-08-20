import { catchAsync } from "@/utils/catchAsync";
import { withProjectAuth } from "@/utils/withProjectAuth";
import { SourceFlowService } from "@/lib/services/sourseFlowService";
// GET /api/projects/[projectId]/loans/[loanId]/loanCashFlow
export const GET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return SourceFlowService.getPaymentsFromSource(projectId,userId, {
      type : 'loan',
      id : context.params.loanId
    })
  })
);