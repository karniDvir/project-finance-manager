import { LoanService } from "@/lib/services/loanService";
import { catchAsync } from "@/utils/catchAsync";
import { getUserId } from "@/lib/auth";

// GET /api/projects/[id]/loans
export const GET = catchAsync(async (req, { params }) => {
  return LoanService.getLoansWithBalance(req,params.id);
});

// POST /api/projects/[id]/loans
export const POST = catchAsync(async (req, { params }) => {
  const userId = await getUserId();
  return LoanService.create(req, params.id);
});
