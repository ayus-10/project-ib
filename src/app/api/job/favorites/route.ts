import {
  BadRequest,
  InternalServerError,
  NotFound,
  Ok,
  Unauthorized,
} from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";
import { JobWithFavorite } from "@/interfaces/JobWithFavorite";
import { getPageNumberFromParams, getUserIdFromHeaders } from "../../helpers";
import { BadRequestError, UnauthorizedError } from "@/utils/customErrors";

const prisma = new PrismaClient();

// get only favorite jobs
export async function GET(request: Request) {
  try {
    const userId = getUserIdFromHeaders(request);
    const pageNumber = getPageNumberFromParams(request);

    let jobs: JobWithFavorite[] = [];

    jobs = await prisma.job.findMany({
      where: { favoriteBy: { some: { userId } } },
      take: 5,
      skip: (pageNumber - 1) * 5,
      orderBy: { id: "desc" },
    });

    if (jobs.length === 0) {
      return NotFound("No more favorite jobs.");
    }

    jobs.forEach((job) => {
      job.isFavorite = true;
    });

    return Ok({ jobs });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return BadRequest(error.message);
    }
    if (error instanceof UnauthorizedError) {
      return Unauthorized(error.message);
    }
    return InternalServerError(error);
  }
}
