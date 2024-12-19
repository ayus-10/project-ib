import {
  BadRequest,
  InternalServerError,
  Ok,
  Unauthorized,
} from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const userId = parseInt(request.headers.get("x-id") ?? "");

    if (Number.isNaN(userId)) {
      return Unauthorized("Please log in to continue.");
    }

    const jobId = parseInt(
      new URL(request.url).searchParams.get("jobId") ?? ""
    );

    if (Number.isNaN(jobId)) {
      return BadRequest("Invalid job ID.");
    }

    const jobFound = await prisma.job.findFirst({ where: { id: jobId } });

    if (!jobFound) {
      return BadRequest("Invalid job ID.");
    }

    await prisma.favorite.create({ data: { userId, jobId } });

    return Ok("Job added to favorites list.");
  } catch (error) {
    return InternalServerError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = parseInt(request.headers.get("x-id") ?? "");

    if (Number.isNaN(userId)) {
      return Unauthorized("Please log in to continue.");
    }

    const jobId = parseInt(
      new URL(request.url).searchParams.get("jobId") ?? ""
    );

    if (Number.isNaN(jobId)) {
      return BadRequest("Invalid job ID.");
    }

    await prisma.favorite.delete({
      where: { userId_jobId: { jobId, userId } },
    });

    return Ok("Job removed from favorites list.");
  } catch (error) {
    return InternalServerError(error);
  }
}
