import {
  BadRequest,
  InternalServerError,
  Ok,
  Unauthorized,
} from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";
import { getJobIdFromParams, getUserIdFromHeaders } from "../helpers";
import { BadRequestError, UnauthorizedError } from "@/utils/customErrors";

const prisma = new PrismaClient();

// add job to favorites
export async function POST(request: Request) {
  try {
    const userId = getUserIdFromHeaders(request);

    const jobId = getJobIdFromParams(request);

    const jobFound = await prisma.job.findFirst({ where: { id: jobId } });
    if (!jobFound) {
      return BadRequest("Invalid job ID.");
    }

    await prisma.favorite.create({ data: { userId, jobId } });

    return Ok("Job added to favorites list.");
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Unauthorized(error.message);
    }
    if (error instanceof BadRequestError) {
      return BadRequest(error.message);
    }
    return InternalServerError(error);
  }
}

// remove job from favorites
export async function DELETE(request: Request) {
  try {
    const userId = getUserIdFromHeaders(request);

    const jobId = getJobIdFromParams(request);

    await prisma.favorite.delete({
      where: { userId_jobId: { jobId, userId } },
    });

    return Ok("Job removed from favorites list.");
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Unauthorized(error.message);
    }
    if (error instanceof BadRequestError) {
      return BadRequest(error.message);
    }
    return InternalServerError(error);
  }
}
