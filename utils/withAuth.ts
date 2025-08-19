// utils/withAuth.ts
import { getUserId } from "@/lib/auth";

export function withAuth<T extends (...args: any[]) => Promise<any>>(handler: (req: Request, userId: string, context: any) => Promise<any>) {
  return async (req: Request, context: any) => {
    const userId = await getUserId();
    return handler(req, userId, context);
  };
}
