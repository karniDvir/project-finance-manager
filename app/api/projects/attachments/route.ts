import { AttachmentService } from "@/lib/services/attachmentService";
import { catchAsync } from "@/utils/catchAsync";
import { withProjectAuth } from "@/utils/withProjectAuth";

// GET /api/projects/[id]/attachments
export const GET = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return AttachmentService.list(req, projectId);
  })
);

// POST /api/projects/[id]/attachments
export const POST = catchAsync(
  withProjectAuth(async (req, userId, context, projectId) => {
    return AttachmentService.create(req, projectId);
  })
);
