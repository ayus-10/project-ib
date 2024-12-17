type JobType = "REMOTE" | "HYBRID" | "ONSITE";

export interface GetJobDTO {
  jobId: number;
}

export interface CreateJobDTO {
  title: string;
  description: string;
  company: string;
  location: string;
  created: string;
  deadline: string;
  type: JobType;
}

export interface UpdateJobDTO {
  title: string;
  description: string;
  company: string;
  location: string;
  created: string;
  deadline: string;
  type: JobType;
  jobId: number;
}

export interface DeleteJobDTO {
  jobId: number;
}
