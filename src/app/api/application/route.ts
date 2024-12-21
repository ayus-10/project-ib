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
} from "@/utils/jobDetailsValidation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const userId = parseInt(request.headers.get("x-id") ?? "");
    if (Number.isNaN(userId)) {
      return Unauthorized("Please log in to continue.");
    }

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
    return InternalServerError(error);
  }
}

export async function GET(request: Request) {
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

    const applications = await prisma.application.findMany({
      select: {
        applicant: { select: { email: true, fullName: true } },
        coverLetter: true,
      },
      where: { job: { userId }, jobId },
    });

    return Ok({ applications });
  } catch (error) {
    return InternalServerError(error);
  }
}
