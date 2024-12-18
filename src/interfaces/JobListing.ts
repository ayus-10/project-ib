export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  type: "REMOTE" | "HYBRID" | "ONSITE";
  created: string;
  deadline: string;
}
