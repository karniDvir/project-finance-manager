import { PaymentService } from "@/lib/services/paymentService";
import { catchAsync } from "@/utils/catchAsync";
import { getUserId } from "@/lib/auth";

// GET /api/projects/[id]/payments
export const GET = catchAsync(async (req, { params }) => {
  const userId = await getUserId();
  return PaymentService.list(req, params.id);
});

// POST /api/projects/[id]/payments
export const POST = catchAsync(async (req, { params }) => {
  const userId = await getUserId();
  return PaymentService.createPayment(req, params.id);
});
