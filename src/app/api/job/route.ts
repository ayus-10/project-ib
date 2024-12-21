import { CreateJobDTO } from "@/interfaces/CreateJobDTO";
import { UpdateJobDTO } from "@/interfaces/UpdateJobDTO";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  Ok,
  Unauthorized,
} from "@/utils/httpResponses";
import {
  areJobDetailsValid,
  hasMinimumWords,
  isValidNumber,
} from "@/utils/jobDetailsValidation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const jobId = parseInt(url.searchParams.get("jobId") ?? "");

    if (!jobId || Number.isNaN(jobId)) {
      return BadRequest("Invalid job ID.");
    }

    const job = await prisma.job.findFirst({ where: { id: jobId } });

    if (!job) {
      return NotFound("Specified job not found.");
    }

    return Ok({ job });
  } catch (error) {
    return InternalServerError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { company, description, location, title, created, deadline, type } =
      (await request.json()) as CreateJobDTO;

    const userIdString = request.headers.get("x-id");
    if (!userIdString) {
      return Unauthorized("Please log in to continue.");
    }

    const userId = parseInt(userIdString);

    if (
      !areJobDetailsValid(
        company,
        description,
        location,
        title,
        created,
        deadline,
        type
      )
    ) {
      return BadRequest("Please make sure all the provided data are valid.");
    }

    if (!hasMinimumWords(description)) {
      return BadRequest("The description must contain atleast 50 words.");
    }

    await prisma.job.create({
      data: {
        company,
        description,
        location,
        title,
        userId,
        created: new Date(created),
        deadline: new Date(deadline),
        type,
      },
    });

    return Ok("Job listing created successfully.");
  } catch (error) {
    return InternalServerError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const {
      company,
      description,
      jobId,
      location,
      title,
      created,
      deadline,
      type,
    } = (await request.json()) as UpdateJobDTO;

    if (
      !areJobDetailsValid(
        company,
        description,
        location,
        title,
        created,
        deadline,
        type
      )
    ) {
      return BadRequest("Please make sure all the provided data are valid.");
    }

    if (!hasMinimumWords(description)) {
      return BadRequest("The description must contain atleast 50 words.");
    }

    if (!isValidNumber(jobId)) {
      return BadRequest("Invalid job ID.");
    }

    const userIdString = request.headers.get("x-id");
    if (!userIdString) {
      return Unauthorized("Please log in to continue.");
    }

    const userId = parseInt(userIdString);

    const job = await prisma.job.findFirst({ where: { id: jobId } });

    if (!job) {
      return NotFound("Specified job not found.");
    }

    if (job.userId !== userId) {
      return Unauthorized("Not authorized to modify the job details.");
    }

    await prisma.job.update({
      where: { id: jobId },
      data: {
        company,
        description,
        location,
        title,
        created: new Date(created),
        deadline: new Date(deadline),
        type,
      },
    });

    return Ok("Job listing updated successfully.");
  } catch (error) {
    return InternalServerError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const jobId = parseInt(url.searchParams.get("jobId") ?? "");

    if (!jobId || Number.isNaN(jobId)) {
      return BadRequest("Invalid job ID.");
    }

    const job = await prisma.job.findFirst({ where: { id: jobId } });

    if (!job) {
      return NotFound("Specified job not found.");
    }

    const userIdString = request.headers.get("x-id");
    if (!userIdString) {
      return Unauthorized("Please log in to continue.");
    }

    const userId = parseInt(userIdString);

    if (job.userId !== userId) {
      return Unauthorized("Not authorized to delete the job.");
    }

    await prisma.job.delete({ where: { id: jobId } });

    return Ok("Job listing deleted successfully.");
  } catch (error) {
    return InternalServerError(error);
  }
}
