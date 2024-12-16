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
} from "@/utils/jobDetailsValidation";
import { PrismaClient } from "@prisma/client";

interface GetJobDTO {
  jobId: number;
}

interface CreateJobDTO {
  title: string;
  description: string;
  company: string;
  location: string;
  created: string;
  deadline: string;
}

interface UpdateJobDTO {
  title: string;
  description: string;
  company: string;
  location: string;
  created: string;
  deadline: string;
  jobId: number;
}

interface DeleteJobDTO {
  jobId: number;
}

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { jobId } = (await request.json()) as GetJobDTO;
    if (!jobId) {
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
    const { company, description, location, title, created, deadline } =
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
        deadline
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
      },
    });

    return Ok("Job listing created successfully.");
  } catch (error) {
    return InternalServerError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { company, description, jobId, location, title, created, deadline } =
      (await request.json()) as UpdateJobDTO;

    if (
      !areJobDetailsValid(
        company,
        description,
        location,
        title,
        created,
        deadline
      )
    ) {
      return BadRequest("Please make sure all the provided data are valid.");
    }

    if (!hasMinimumWords(description)) {
      return BadRequest("The description must contain atleast 50 words.");
    }

    if (!jobId) {
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
      },
    });

    return Ok("Job listing updated successfully.");
  } catch (error) {
    return InternalServerError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { jobId } = (await request.json()) as DeleteJobDTO;
    if (!jobId) {
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
