import { catchAsync } from "@/utils/catchAsync";
import { PaymentService } from "@/lib/services/paymentService";
import { withProjectAuth } from "@/utils/withProjectAuth";

// GET /api/projects/:projectId/beneficiaries/:beneficiaryId/payments
export const GET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    const { beneficiaryId } = context.params;
    return PaymentService.listByRelation(
      req,
      userId,
      projectId,
      "beneficiaryId",
      beneficiaryId
    );
  })
);

// POST /api/projects/:projectId/beneficiaries/:beneficiaryId/payments
export const POST = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    const { beneficiaryId } = context.params;
    return PaymentService.createForRelation(
      req,
      userId,
      projectId,
      "beneficiaryId",
      beneficiaryId
    );
  })
);
