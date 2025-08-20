import { ProjectService } from "@/lib/services/projectService";
import { catchAsync } from "@/utils/catchAsync";
import { withAuth } from "@/utils/withAuth";

// GET /api/projects/[id]
export const GET = catchAsync(
  withAuth(async (req, userId, context) => {
    const { params } = await context;
    return ProjectService.getById(params.id, userId);
  })
);

// PUT /api/projects/[id]
export const PUT = catchAsync(
  withAuth(async (req, userId, context) => {
    const { params } = await context;
    return ProjectService.update(params.id, req, userId);
  })
);

// DELETE /api/projects/[id]
export const DELETE = catchAsync(
  withAuth(async (req, userId, context) => {
    const { params } = await context;
    return ProjectService.remove(params.id, userId);
  })
);
