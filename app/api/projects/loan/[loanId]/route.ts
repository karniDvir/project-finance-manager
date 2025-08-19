import { LoanService } from "@/lib/services/loanService";
import { catchAsync } from "@/utils/catchAsync";
import { getUserId } from "@/lib/auth";

// GET /api/projects/[id]/loans/[loanId]
export const GET = catchAsync(async (req, { params }) => {
  return LoanService.getById(params.loanId, params.id);
});

// PUT /api/projects/[id]/loans/[loanId]
export const PUT = catchAsync(async (req, { params }) => {
  return LoanService.update(params.loanId, req, params.id);
});

// DELETE /api/projects/[id]/loans/[loanId]
export const DELETE = catchAsync(async (req, { params }) => {
  return LoanService.remove(params.loanId, params.id);
});
