import { BadRequest, InternalServerError, Ok } from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userIdString = request.headers.get("x-id");

    const pageNumberString = new URL(request.url).searchParams.get(
      "pageNumber"
    );

    if (userIdString) {
      const userId = parseInt(userIdString);

      const jobs = await prisma.job.findMany({ where: { userId } });

      return Ok({ jobs });
    }

    if (pageNumberString) {
      const pageNumber = parseInt(pageNumberString);
      if (Number.isNaN(pageNumber) || pageNumber < 0) {
        return BadRequest("Invalid page number.");
      }

      const jobs = await prisma.job.findMany({
        take: 10,
        skip: pageNumber,
        orderBy: { id: "desc" },
      });

      return Ok({ jobs });
    }

    return BadRequest("Can not fetch without specifying boundaries.");
  } catch (error) {
    return InternalServerError(error);
  }
}
