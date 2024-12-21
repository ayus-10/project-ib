"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { ACCESS_TOKEN } from "@/constants";
import { CreateApplicationDTO } from "@/interfaces/CreateApplicationDTO";
import { JobListing } from "@/interfaces/JobListing";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setErrorMessage, setSuccessMessage } from "@/redux/slices/alertSlice";
import refreshTokens from "@/requests/refreshTokens";
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

  const { email, fullName } = useAppSelector(
    (state) => state.authenticatedUser
  );

  const isLoggedIn = !!email && !!fullName;

  const [jobDetails, setJobDetails] = useState<JobListing | undefined>(
    undefined
  );

  const dispatch = useAppDispatch();

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

    const jobIdInt = parseInt(jobId ?? "");

    if (!letterInputRef.current) return;
    if (Number.isNaN(jobIdInt)) return;

    submitApplication({
      coverLetter: letterInputRef.current.value,
      jobId: jobIdInt,
    });
  }

  async function submitApplication(payload: CreateApplicationDTO) {
    const sendRequest = () =>
      axios.post("/api/application", payload, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      });

    try {
      const res = await sendRequest();
      dispatch(setSuccessMessage(res.data.message));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        try {
          await refreshTokens();
          const newRes = await sendRequest();
          dispatch(setSuccessMessage(newRes.data.message));
        } catch (newError) {
          if (axios.isAxiosError(newError)) {
            dispatch(setErrorMessage(newError?.response?.data.error));
          }
        }
      }
      console.log("Unable to submit application: ", error);
    }
  }

  if (jobDetails && isLoggedIn)
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
              type="text"
              value={fullName}
              disabled
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control w-full">
            <div className="label">Email</div>
            <input
              type="text"
              value={email}
              disabled
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
