import { CreateJobDTO as JobDetails } from "@/interfaces/CreateJobDTO";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/customErrors";
import { areJobDetailsValid, hasMinimumWords } from "@/utils/detailsValidation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function getUserIdFromHeaders(request: Request) {
  const userId = parseInt(request.headers.get("x-id") ?? "");
  if (Number.isNaN(userId)) {
    throw new UnauthorizedError("Please log in to continue.");
  }
  return userId;
}

export function getJobIdFromParams(request: Request) {
  const jobId = parseInt(new URL(request.url).searchParams.get("jobId") ?? "");
  if (Number.isNaN(jobId)) {
    throw new BadRequestError("Invalid job ID.");
  }
  return jobId;
}

export function getTokenSecrets() {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error(
      "Access or refresh token secrets not found in environments."
    );
  }
  return [ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET] as const;
}

export async function getValidJob(id: number) {
  const job = await prisma.job.findFirst({ where: { id } });
  if (!job) {
    throw new NotFoundError("Specified job not found.");
  }
  return job;
}

export function validateJobDetails(data: JobDetails) {
  const { company, description, location, title, created, deadline, type } =
    data;

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
    throw new BadRequestError(
      "Please make sure all the provided data are valid."
    );
  }

  if (!hasMinimumWords(description)) {
    throw new BadRequestError("The description must contain atleast 50 words.");
  }
}

export function getPageNumberFromParams(request: Request) {
  const pageNumber = parseInt(
    new URL(request.url).searchParams.get("pageNumber") ?? ""
  );
  if (Number.isNaN(pageNumber)) {
    throw new BadRequestError("Can not fetch without specifying limits.");
  }
  return pageNumber;
}
