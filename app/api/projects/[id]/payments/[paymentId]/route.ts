import { PaymentService } from "@/lib/services/paymentService";
import { catchAsync } from "@/utils/catchAsync";
import { withProjectAuth } from "@/utils/withProjectAuth";

// GET /api/projects/[id]/payments/[paymentId]
export const GET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    console.log(projectId)
    return PaymentService.getById(context.params.paymentId, projectId);
  })
);

// PUT /api/projects/[id]/payments/[paymentId]
export const PUT = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return PaymentService.updatePayment(req,userId,projectId,context.params.paymentId);
  })
);

// DELETE /api/projects/[id]/payments/[paymentId]
export const DELETE = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return PaymentService.remove(context.params.paymentId, projectId);
  })
);
