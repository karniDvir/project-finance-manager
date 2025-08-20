import { catchAsync } from "@/utils/catchAsync";
import { PaymentService } from "@/lib/services/paymentService";
import { withProjectAuth } from "@/utils/withProjectAuth";

// GET /api/projects/:projectId/loans/:loanId/payments
export const GET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    const loanId = context.params.loanId;

    const asSource = await PaymentService.listByRelation(
      req, userId, projectId, "loanSourceId", loanId
    );
    const asTarget = await PaymentService.listByRelation(
      req, userId, projectId, "loanTargetId", loanId
    );

    return { asSource, asTarget };
  })
);

// POST /api/projects/:projectId/loans/:loanId/payments
export const POST = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    let relation: "loanSourceId" | "loanTargetId";
    const body = await req.json();

    if (body.kind === "REPAYMENT") {
      relation = "loanTargetId";
    } else {
      relation = "loanSourceId";
    }

    return PaymentService.createForRelation(
      req,
      userId,
      projectId,
      relation,
      context.params.loanId
    );
  })
);
