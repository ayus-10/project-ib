"use client";

import { ACCESS_TOKEN } from "@/constants";
import refreshTokens from "@/requests/refreshTokens";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";

interface Job {
  id: string;
  title: string;
  company: string;
  created: string;
  deadline: string;
}

interface GetJobsResponse {
  jobs: Job[];
}

export default function Manage() {
  const [createdJobs, setCreatedJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function getJobs() {
      try {
        await refreshTokens();
        const res = await axios.get<GetJobsResponse>("/api/job/all", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        });
        setCreatedJobs(res.data.jobs);
      } catch (error) {
        console.log("Unable to fetch jobs: ", error);
      }
    }

    getJobs();
  }, []);

  return (
    <div className="overflow-x-auto h-full py-4">
      <table className="table table-zebra table-fixed">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Company</th>
            <th>Created</th>
            <th>Deadline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {createdJobs.map((job, i) => (
            <tr key={job.id}>
              <th>{i + 1}</th>
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>{new Date(job.created).toDateString()}</td>
              <td>{new Date(job.deadline).toDateString()}</td>
              <td>
                <button className="btn text-base btn-sm btn-outline lg:rounded-r-none">
                  <IoMdSettings />
                </button>
                <button className="btn text-base btn-sm btn-outline lg:rounded-l-none">
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
