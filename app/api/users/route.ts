import { prisma } from "@/lib/prisma";
import { catchAsync } from "@/utils/catchAsync";
import { buildQuery } from "@/utils/queryBuilder";
import { withAuthAdmin } from "@/utils/withAuthAdmin";
import { AppError } from "@/utils/AppError";
// GET /api/users
export const GET = catchAsync(
  withAuthAdmin(async (req) =>{
  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());
  const { where: filters, orderBy } = buildQuery(query);

  const users : any =  prisma.user.findMany({
    where: filters,
    orderBy,
  });
   if (users.length === 0) {
      throw new AppError("No users found", 404);
    }
    return users;
}));
