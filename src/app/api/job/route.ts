import { CreateJobDTO } from "@/interfaces/CreateJobDTO";
import { UpdateJobDTO } from "@/interfaces/UpdateJobDTO";
import {
  BadRequest,
  InternalServerError,
  NotFound,
  Ok,
  Unauthorized,
} from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";
import {
  getJobIdFromParams,
  getUserIdFromHeaders,
  getValidJob,
  validateJobDetails,
} from "../helpers";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/customErrors";

const prisma = new PrismaClient();

// get job with given id
export async function GET(request: Request) {
  try {
    const jobId = getJobIdFromParams(request);

    const job = await getValidJob(jobId);

    return Ok({ job });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return BadRequest(error.message);
    }
    if (error instanceof NotFoundError) {
      return NotFound(error.message);
    }
    return InternalServerError(error);
  }
}

// create new job
export async function POST(request: Request) {
  try {
    const createJobDto = (await request.json()) as CreateJobDTO;

    const { company, description, location, title, created, deadline, type } =
      createJobDto;

    const userId = getUserIdFromHeaders(request);

    validateJobDetails(createJobDto);

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
    if (error instanceof UnauthorizedError) {
      return Unauthorized(error.message);
    }
    if (error instanceof BadRequestError) {
      return BadRequest(error.message);
    }
    return InternalServerError(error);
  }
}

// update existing job with given id
export async function PATCH(request: Request) {
  try {
    const updateJobDto = (await request.json()) as UpdateJobDTO;

    const { company, description, location, title, created, deadline, type } =
      updateJobDto;

    validateJobDetails(updateJobDto);

    const userId = getUserIdFromHeaders(request);

    const jobId = getJobIdFromParams(request);

    const job = await getValidJob(jobId);

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
    if (error instanceof BadRequestError) {
      return BadRequest(error.message);
    }
    if (error instanceof UnauthorizedError) {
      return Unauthorized(error.message);
    }
    if (error instanceof NotFoundError) {
      return NotFound(error.message);
    }
    return InternalServerError(error);
  }
}

// delete job with given id
export async function DELETE(request: Request) {
  try {
    const jobId = getJobIdFromParams(request);

    const job = await getValidJob(jobId);

    const userId = getUserIdFromHeaders(request);

    if (job.userId !== userId) {
      return Unauthorized("Not authorized to delete the job.");
    }

    await prisma.job.delete({ where: { id: jobId } });

    return Ok("Job listing deleted successfully.");
  } catch (error) {
    if (error instanceof BadRequestError) {
      return BadRequest(error.message);
    }
    if (error instanceof UnauthorizedError) {
      return Unauthorized(error.message);
    }
    if (error instanceof NotFoundError) {
      return NotFound(error.message);
    }
    return InternalServerError(error);
  }
}
