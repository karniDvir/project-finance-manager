import { LoanService } from "@/lib/services/loanService";
import { catchAsync } from "@/utils/catchAsync";
import { withProjectAuth } from "@/utils/withProjectAuth";

// GET /api/projects/[projectId]/loans/[loanId]
export const GET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return LoanService.getById(context.params.loanId, userId, projectId);
  })
);

// PUT /api/projects/[projectId]/loans/[loanId]
export const PUT = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return LoanService.update(context.params.loanId, req, userId, projectId);
  })
);

// DELETE /api/projects/[projectId]/loans/[loanId]
export const DELETE = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return LoanService.remove(context.params.loanId, userId, projectId);
  })
);
