export interface UpdateJobDTO {
  title: string;
  description: string;
  company: string;
  location: string;
  created: string;
  deadline: string;
  type: "REMOTE" | "HYBRID" | "ONSITE";
}
