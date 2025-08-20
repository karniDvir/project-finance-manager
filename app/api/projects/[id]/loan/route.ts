import { LoanService } from "@/lib/services/loanService";
import { catchAsync } from "@/utils/catchAsync";
import { withProjectAuth } from "@/utils/withProjectAuth";

// GET /api/projects/[projectId]/loans
export const GET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return LoanService.getLoansWithBalance(req, userId, projectId);
  })
);

// POST /api/projects/[projectId]/loans
export const POST = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return LoanService.create(req, userId, projectId);
  })
);
