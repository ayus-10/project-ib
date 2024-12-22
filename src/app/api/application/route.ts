import { CreateApplicationDTO } from "@/interfaces/CreateApplicationDTO";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  Ok,
  Unauthorized,
} from "@/utils/httpResponses";
import {
  hasMinimumWords,
  isValidNumber,
  isValidString,
} from "@/utils/detailsValidation";
import { PrismaClient } from "@prisma/client";
import { getJobIdFromParams, getUserIdFromHeaders } from "../helpers";
import { BadRequestError, UnauthorizedError } from "@/utils/customErrors";

const prisma = new PrismaClient();

// submit job application
export async function POST(request: Request) {
  try {
    const userId = getUserIdFromHeaders(request);

    const { coverLetter, jobId } =
      (await request.json()) as CreateApplicationDTO;

    if (!isValidNumber(jobId)) {
      return BadRequest("Invalid job ID.");
    }
    if (!isValidString(coverLetter) || !hasMinimumWords(coverLetter)) {
      return BadRequest("Cover letter must have at least 50 words.");
    }

    const jobFound = await prisma.job.findFirst({ where: { id: jobId } });
    if (!jobFound) {
      return NotFound("Specified job was not found.");
    }

    const existingApplication = await prisma.application.findFirst({
      where: { applicantId: userId, jobId },
    });
    if (existingApplication) {
      return BadRequest("Already applied for this job.");
    }

    await prisma.application.create({
      data: { applicantId: userId, jobId, coverLetter },
    });

    return Ok("Successfully applied for the job.");
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return Unauthorized(error.message);
    }
    return InternalServerError(error);
  }
}

// get all applications for given user and job
export async function GET(request: Request) {
  try {
    const userId = getUserIdFromHeaders(request);

    const jobId = getJobIdFromParams(request);

    const applications = await prisma.application.findMany({
      select: {
        applicant: { select: { email: true, fullName: true } },
        coverLetter: true,
        id: true,
      },
      where: { job: { userId }, jobId },
    });

    return Ok({ applications });
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
