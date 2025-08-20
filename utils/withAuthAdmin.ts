import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { AppError } from "@/utils/AppError";

export function withAuthAdmin(
  handler: (req: Request,  context: any) => Promise<any>
) {
  return async (req: Request, context: any) => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new AppError("Unauthorized", 401);
    }

    if (session.user.role !== "ADMIN") {
      throw new AppError("Forbidden: Admins only", 403);
    }

    return handler(req, context);
  };
}
