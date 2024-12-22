import { ADMIN } from "@/constants";
import {
  BadRequest,
  InternalServerError,
  Ok,
  Unauthorized,
} from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";
import { getUserIdFromHeaders } from "../../helpers";
import { UnauthorizedError } from "@/utils/customErrors";

const prisma = new PrismaClient();

// get all created jobs
export async function GET(request: Request) {
  try {
    const userId = getUserIdFromHeaders(request);
    const userRole = request.headers.get("x-role");

    if (userRole !== ADMIN) {
      return BadRequest("Only admins can find created jobs.");
    }

    const jobs = await prisma.job.findMany({ where: { userId } });
    return Ok({ jobs });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Unauthorized(error.message);
    }
    return InternalServerError(error);
  }
}
