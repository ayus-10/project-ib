"use client";

import { JobListing } from "@/interfaces/JobListing";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage } from "@/redux/slices/alertSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { GoStar } from "react-icons/go";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { RiBuilding2Fill } from "react-icons/ri";
import { TbClockHour10Filled, TbClockHour2Filled } from "react-icons/tb";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  const [jobs, setJobs] = useState<JobListing[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getJobs() {
      try {
        const res = await axios.get(
          "/api/job/all?pageNumber=" + 5 * (currentPage - 1)
        );
        setJobs(res.data.jobs);
      } catch (error) {
        setCurrentPage((prev) => prev - 1);
        if (axios.isAxiosError(error)) {
          dispatch(setErrorMessage(error?.response?.data.error));
        }
        console.log("Unable to fetch for jobs: ", error);
      }
    }

    getJobs();
  }, [currentPage]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center p-2">
      <div className="grow">
        {jobs.map((j) => (
          <JobCard job={j} key={j.id} />
        ))}
      </div>
      <div className="join py-4">
        <button
          className="join-item btn"
          onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1))}
        >
          <LuChevronLeft />
        </button>
        <button className="join-item btn">Page {currentPage}</button>
        <button
          className="join-item btn"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <LuChevronRight />
        </button>
      </div>
    </div>
  );
}

function JobCard({ job }: { job: JobListing }) {
  return (
    <div className="card my-4 mx-auto bg-base-100 shadow-xl w-2/5 min-w-72 md:min-w-96">
      <div className="card-body">
        <h2 className="card-title">{job.title}</h2>
        <span className="font-semibold flex items-center gap-1">
          <span className="flex-shrink-0">
            <RiBuilding2Fill />
          </span>
          <span>{job.company}</span>
        </span>
        <span className="font-semibold flex items-center gap-1">
          <span className="flex-shrink-0">
            <FaLocationDot />
          </span>
          <span>
            {job.location} {job.type !== "REMOTE" ? `(${job.type})` : null}
          </span>
        </span>
        <span className="font-semibold flex items-center gap-1">
          <span className="flex-shrink-0">
            <TbClockHour2Filled />
          </span>
          <span>
            Listed {new Date(job.created).toISOString().split("T")[0]}
          </span>
        </span>
        <span className="font-semibold flex items-center gap-1">
          <span className="flex-shrink-0">
            <TbClockHour10Filled />
          </span>
          <span>
            Deadline {new Date(job.deadline).toISOString().split("T")[0]}
          </span>
        </span>
        <p className="line-clamp-4">{job.description}</p>
        <div className="card-actions justify-end">
          <button className="btn">
            <GoStar />
          </button>
          <button className="btn btn-primary">View more</button>
        </div>
      </div>
    </div>
  );
}
