import { BeneficiaryService } from "@/lib/services/beneficiaryService";
import { catchAsync } from "@/utils/catchAsync";
import { getUserId } from "@/lib/auth";

// GET /api/projects/[id]/beneficiaries
export const GET = catchAsync(async (req, { params }) => {
  return BeneficiaryService.list(req, params.id);
});

// POST /api/projects/[id]/beneficiaries
export const POST = catchAsync(async (req, { params }) => {
  return BeneficiaryService.create(req, params.id);
});
