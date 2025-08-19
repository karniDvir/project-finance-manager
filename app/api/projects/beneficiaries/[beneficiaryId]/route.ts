import { BeneficiaryService } from "@/lib/services/beneficiaryService";
import { catchAsync } from "@/utils/catchAsync";
import { getUserId } from "@/lib/auth";

// GET /api/projects/[id]/beneficiaries/[beneficiaryId]
export const GET = catchAsync(async (req, { params }) => {
  const userId = await getUserId();
  return BeneficiaryService.getById(params.beneficiaryId, params.id);
});

// PUT /api/projects/[id]/beneficiaries/[beneficiaryId]
export const PUT = catchAsync(async (req, { params }) => {
  const userId = await getUserId();
  return BeneficiaryService.update(params.beneficiaryId, req, params.id);
});

// DELETE /api/projects/[id]/beneficiaries/[beneficiaryId]
export const DELETE = catchAsync(async (req, { params }) => {
  const userId = await getUserId();
  return BeneficiaryService.remove(params.beneficiaryId, params.id);
});
