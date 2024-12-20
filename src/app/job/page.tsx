"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { JobListing } from "@/interfaces/JobListing";
import { formattedDate } from "@/utils/formatJobDetails";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FaLocationDot, FaUserGear } from "react-icons/fa6";
import { RiBuilding2Fill } from "react-icons/ri";
import { TbClockHour10Filled, TbClockHour2Filled } from "react-icons/tb";

interface GetJobListing {
  job: JobListing;
}

export default function Job() {
  const jobId = useSearchParams().get("id");

  const router = useRouter();

  const [jobDetails, setJobDetails] = useState<JobListing | undefined>(
    undefined
  );

  const fullNameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const letterInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function getJob() {
      try {
        const res = await axios.get<GetJobListing>("/api/job?jobId=" + jobId);
        setJobDetails(res.data.job);
      } catch (error) {
        router.push("/");
        console.log("Unable to load job: ", error);
      } finally {
      }
    }
    getJob();
  }, [router, jobId]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  if (jobDetails)
    return (
      <div className="flex flex-col gap-4 md:px-8 px-4 py-6 md:flex-row h-[calc(100vh-4rem)]">
        <div className="md:w-1/2 lg:w-2/3">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="text-lg md:text-xl">
              <h2 className="font-semibold">Job title</h2>
              <h2>{jobDetails.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-base md:text-lg">
              <span>
                <div className="flex items-center gap-1">
                  <span className="flex-shrink-0">
                    <RiBuilding2Fill />
                  </span>
                  <span className="font-semibold">Company</span>
                </div>
                <span>{jobDetails.company}</span>
              </span>
              <span>
                <div className="flex items-center gap-1">
                  <span className="flex-shrink-0">
                    <FaLocationDot />
                  </span>
                  <span className="font-semibold">Location</span>
                </div>
                <span>{jobDetails.location}</span>
              </span>
              <span>
                <div className="flex items-center gap-1">
                  <span className="flex-shrink-0">
                    <FaUserGear />
                  </span>
                  <span className="font-semibold">Job type</span>
                </div>
                <span>{jobDetails.type}</span>
              </span>
              <span>
                <div className="flex items-center gap-1">
                  <span className="flex-shrink-0">
                    <TbClockHour2Filled />
                  </span>
                  <span className="font-semibold">Job listed</span>
                </div>
                <span>{formattedDate(jobDetails.created)}</span>
              </span>
              <span>
                <div className="flex items-center gap-1">
                  <span className="flex-shrink-0">
                    <TbClockHour10Filled />
                  </span>
                  <span className="font-semibold">Deadline</span>
                </div>
                <span>{formattedDate(jobDetails.deadline)}</span>
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-base md:text-lg">
                Description
              </h2>
              <p className="text-sm md:text-base">{jobDetails.description}</p>
            </div>
          </div>
        </div>
        <div className="divider md:divider-horizontal"></div>
        <form
          className="flex flex-col gap-2 md:w-1/2 lg:w-1/3 pb-8 md:pb-0"
          onSubmit={handleSubmit}
        >
          <h2 className="card-title">Apply for the job!</h2>
          <label className="form-control w-full">
            <div className="label">Full name</div>
            <input
              ref={fullNameInputRef}
              type="text"
              placeholder="John Cena"
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control w-full">
            <div className="label">Email</div>
            <input
              ref={emailInputRef}
              type="text"
              placeholder="johncena@example.com"
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control w-full">
            <div className="label">Upload resume</div>
            <input
              ref={resumeInputRef}
              type="file"
              className="file-input file-input-primary file-input-bordered w-full"
            />
          </label>
          <textarea
            ref={letterInputRef}
            className="textarea textarea-bordered overflow-y-hidden my-2 h-full"
            rows={5}
            placeholder="Write a cover letter"
          ></textarea>
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    );

  return <LoadingSpinner />;
}