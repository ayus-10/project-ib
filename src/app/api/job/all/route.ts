import {
  BadRequest,
  InternalServerError,
  NotFound,
  Ok,
} from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";
import { JobWithFavorite } from "@/interfaces/JobWithFavorite";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userIdString = request.headers.get("x-id");

    const { searchParams } = new URL(request.url);
    const pageNumberString = searchParams.get("pageNumber");
    const favoritesOnly = searchParams.get("favoritesOnly") === "true";

    const userId = parseInt(userIdString ?? "");
    const pageNumber = parseInt(pageNumberString ?? "");

    const userIdValid = !Number.isNaN(userId);
    const pageNumberValid = !Number.isNaN(pageNumber) && pageNumber >= 0;

    if (!pageNumberValid) {
      return BadRequest("Can not fetch without specifying limits.");
    }

    let jobs: JobWithFavorite[] = [];

    if (favoritesOnly) {
      jobs = await prisma.job.findMany({
        where: { favoriteBy: { some: { userId } } },
        take: 5,
        skip: (pageNumber - 1) * 5,
        orderBy: { id: "desc" },
      });

      jobs.forEach((job) => {
        job.isFavorite = true;
      });

      if (jobs.length === 0) {
        return NotFound("No more favorite jobs found.");
      }
    } else {
      jobs = await prisma.job.findMany({
        take: 5,
        skip: (pageNumber - 1) * 5,
        orderBy: { id: "desc" },
      });

      if (userIdValid) {
        const favorites = (
          await prisma.favorite.findMany({ where: { userId } })
        ).map((f) => f.jobId);

        jobs.forEach((job) => {
          if (favorites.includes(job.id)) {
            job.isFavorite = true;
          }
        });
      }

      if (jobs.length === 0) {
        return NotFound("No more jobs available.");
      }
    }

    return Ok({ jobs });
  } catch (error) {
    return InternalServerError(error);
  }
}
