import {
  BadRequest,
  InternalServerError,
  NotFound,
  Ok,
} from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";
import { JobWithFavorite } from "@/interfaces/JobWithFavorite";
import { getPageNumberFromParams } from "../../helpers";
import { BadRequestError } from "@/utils/customErrors";

const prisma = new PrismaClient();

// get all available jobs
export async function GET(request: Request) {
  try {
    const userId = parseInt(request.headers.get("x-id") ?? "");
    const pageNumber = getPageNumberFromParams(request);
    const userIdValid = !Number.isNaN(userId);

    let jobs: JobWithFavorite[] = [];

    jobs = await prisma.job.findMany({
      take: 5,
      skip: (pageNumber - 1) * 5,
      orderBy: { id: "desc" },
    });

    if (jobs.length === 0) {
      return NotFound("No more jobs available.");
    }

    if (!userIdValid) {
      return Ok({ jobs });
    }

    const favorites = (
      await prisma.favorite.findMany({ where: { userId } })
    ).map((f) => f.jobId);

    jobs.forEach((job) => {
      job.isFavorite = favorites.includes(job.id);
    });

    return Ok({ jobs });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return BadRequest(error.message);
    }
    return InternalServerError(error);
  }
}
