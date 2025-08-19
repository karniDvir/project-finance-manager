import { AttachmentService } from "@/lib/services/attachmentService";
import { catchAsync } from "@/utils/catchAsync";
import { getUserId } from "@/lib/auth";

// GET /api/projects/[id]/attachments
export const GET = catchAsync(async (req, { params }) => {
  return AttachmentService.list(req, params.id);
});

// POST /api/projects/[id]/attachments
export const POST = catchAsync(async (req, { params }) => {
  return AttachmentService.create(req, params.id);
});
