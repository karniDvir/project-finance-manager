import { PaymentService } from "@/lib/services/paymentService";
import { catchAsync } from "@/utils/catchAsync";
import { getUserId } from "@/lib/auth";

// GET /api/projects/[id]/payments/[paymentId]
export const GET = catchAsync(async (req, { params }) => {
  return PaymentService.getById(params.paymentId, params.id);
});

// PUT /api/projects/[id]/payments/[paymentId]
export const PUT = catchAsync(async (req, { params }) => {
  return PaymentService.update(params.paymentId, req, params.id);
});

// DELETE /api/projects/[id]/payments/[paymentId]
export const DELETE = catchAsync(async (req, { params }) => {
  return PaymentService.remove(params.paymentId, params.id);
});
