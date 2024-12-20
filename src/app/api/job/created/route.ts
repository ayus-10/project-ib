import { ADMIN } from "@/constants";
import { BadRequest, InternalServerError, Ok } from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userIdString = request.headers.get("x-id");
    const userRole = request.headers.get("x-role");

    const userId = parseInt(userIdString ?? "");
    const userIdValid = !Number.isNaN(userId);

    if (userIdValid && userRole === ADMIN) {
      const jobs = await prisma.job.findMany({ where: { userId } });
      return Ok({ jobs });
    }

    return BadRequest("Can not find created jobs.");
  } catch (error) {
    return InternalServerError(error);
  }
}
