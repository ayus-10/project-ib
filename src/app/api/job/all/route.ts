import { ADMIN } from "@/constants";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  Ok,
} from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";

interface JobWithFavorite {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  userId: number;
  created: Date;
  deadline: Date;
  type: string;
  isFavorite?: boolean;
}

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userIdString = request.headers.get("x-id");
    const userRole = request.headers.get("x-role");

    const pageNumberString = new URL(request.url).searchParams.get(
      "pageNumber"
    );

    const userId = parseInt(userIdString ?? "");
    const pageNumber = parseInt(pageNumberString ?? "");

    const userIdValid = !Number.isNaN(userId);
    const pageNumberValid = !Number.isNaN(pageNumber) && pageNumber >= 0;

    if (pageNumberValid) {
      let jobs: JobWithFavorite[] = [];

      jobs = await prisma.job.findMany({
        take: 5,
        skip: pageNumber,
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

      return Ok({ jobs });
    }

    if (userIdValid && userRole === ADMIN) {
      const jobs = await prisma.job.findMany({ where: { userId } });
      return Ok({ jobs });
    }

    return BadRequest("Can not fetch without specifying boundaries.");
  } catch (error) {
    return InternalServerError(error);
  }
}
