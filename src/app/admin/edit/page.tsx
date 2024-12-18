"use client";

import JobForm from "@/components/JobForm";
import { ACCESS_TOKEN } from "@/constants";
import { JobListing } from "@/interfaces/JobListing";
import { UpdateJobDTO } from "@/interfaces/UpdateJobDTO";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage, setSuccessMessage } from "@/redux/slices/alertSlice";
import refreshTokens from "@/requests/refreshTokens";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

interface GetJobListing {
  job: JobListing;
}

export default function Edit() {
  const [jobListing, setJobListing] = useState<JobListing | undefined>(
    undefined
  );

  const dispatch = useAppDispatch();

  const jobId = useSearchParams().get("jobId");

  const router = useRouter();

  const [jobType, setJobType] = useState<null | number>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const deadlineInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function getJob() {
      try {
        if (!jobId) {
          throw new Error("Invalid job ID.");
        }
        const res = await axios.get<GetJobListing>("/api/job?jobId=" + jobId);
        setJobListing(res.data.job);
      } catch (error) {
        router.push("/admin");
        console.log("Unable to get job listing: ", error);
      }
    }

    getJob();
  }, [router, jobId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!jobListing) {
      return;
    }

    if (
      !titleInputRef.current ||
      !companyInputRef.current ||
      !locationInputRef.current ||
      !deadlineInputRef.current ||
      !descriptionInputRef.current
    ) {
      return;
    }

    if (!jobType || ![1, 2, 3].includes(jobType)) {
      return;
    }

    const jobIdInt = parseInt(jobId ?? "");

    if (Number.isNaN(jobIdInt)) {
      return;
    }

    const payload: UpdateJobDTO = {
      jobId: jobIdInt,
      title: titleInputRef.current.value,
      company: companyInputRef.current.value,
      location: locationInputRef.current.value || "REMOTE",
      description: descriptionInputRef.current.value,
      deadline: new Date(deadlineInputRef.current.value).toISOString(),
      created: jobListing.created,
      type: jobType === 1 ? "REMOTE" : jobType === 2 ? "HYBRID" : "ONSITE",
    };

    const sendRequest = () =>
      axios.patch("/api/job", payload, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      });

    try {
      await sendRequest();
      dispatch(setSuccessMessage("Successfully updated the job listing."));
      router.push("/admin/manage");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        try {
          await refreshTokens();

          await sendRequest();
          dispatch(setSuccessMessage("Successfully updated the job listing."));
          router.push("/admin/manage");
        } catch (newError) {
          if (axios.isAxiosError(newError)) {
            dispatch(setErrorMessage(newError?.response?.data.error));
          }
          console.log("Unable to update job: ", newError);
        }
      }
    }
  }

  return (
    <div className="w-full p-8 bg-base-200 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Edit: {jobListing?.title}</h1>
        <p>
          Please feel free to review the content carefully, make any changes or
          adjustments and then click the submit button to finalize your updates!
        </p>
      </div>
      <JobForm
        companyRef={companyInputRef}
        deadlineRef={deadlineInputRef}
        descriptionRef={descriptionInputRef}
        handleSubmit={handleSubmit}
        jobType={jobType}
        locationRef={locationInputRef}
        setJobType={setJobType}
        titleRef={titleInputRef}
        defaultValues={jobListing}
      />
    </div>
  );
}
