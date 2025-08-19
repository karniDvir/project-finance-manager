import { createCrudHandlers } from "@/lib/curdFactory";
import { attachmentSchema } from "@/lib/validation";

const base = createCrudHandlers("attachment", attachmentSchema);

export const AttachmentService = {
  ...base,
  // Custom rules for file attachments can be added here later
};