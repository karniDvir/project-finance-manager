import { BeneficiaryService } from "@/lib/services/beneficiaryService";
import { catchAsync } from "@/utils/catchAsync";
import { withProjectAuth } from "@/utils/withProjectAuth";

// GET /api/projects/[projectId]/beneficiaries
export const GET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return BeneficiaryService.list(req, userId, projectId);
  })
);

// POST /api/projects/[projectId]/beneficiaries
export const POST = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return BeneficiaryService.create(req, userId, projectId);
  })
);
