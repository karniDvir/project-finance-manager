import { PaymentService } from "@/lib/services/paymentService";
import { catchAsync } from "@/utils/catchAsync";
import { withProjectAuth } from "@/utils/withProjectAuth";

// GET /api/projects/[id]/payments
export const GET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return PaymentService.list(req, userId, projectId);
  })
);

// POST /api/projects/[id]/payments
export const POST = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return PaymentService.createPayment(req, userId, projectId);
  })
);
