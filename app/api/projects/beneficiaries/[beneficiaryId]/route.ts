import { BeneficiaryService } from "@/lib/services/beneficiaryService";
import { catchAsync } from "@/utils/catchAsync";
import { withProjectAuth } from "@/utils/withProjectAuth";

// GET /api/projects/[projectId]/beneficiaries/[beneficiaryId]
export const GET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return BeneficiaryService.getById(
      context.params.beneficiaryId,
      userId,
      projectId
    );
  })
);

// PUT /api/projects/[projectId]/beneficiaries/[beneficiaryId]
export const PUT = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return BeneficiaryService.update(
      context.params.beneficiaryId,
      req,
      userId,
      projectId
    );
  })
);

// DELETE /api/projects/[projectId]/beneficiaries/[beneficiaryId]
export const DELETE = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return BeneficiaryService.remove(
      context.params.beneficiaryId,
      userId,
      projectId
    );
  })
);
