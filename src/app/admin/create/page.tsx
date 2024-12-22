"use client";

import JobForm from "@/components/JobForm";
import { ACCESS_TOKEN } from "@/constants";
import { CreateJobDTO } from "@/interfaces/CreateJobDTO";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage, setSuccessMessage } from "@/redux/slices/alertSlice";
import refreshTokens from "@/requests/refreshTokens";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

export default function Create() {
  const [jobType, setJobType] = useState<null | number>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const deadlineInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

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

    const payload: CreateJobDTO = {
      title: titleInputRef.current.value,
      company: companyInputRef.current.value,
      location: locationInputRef.current.value || "REMOTE",
      description: descriptionInputRef.current.value,
      deadline: new Date(deadlineInputRef.current.value).toISOString(),
      created: new Date().toISOString(),
      type: jobType === 1 ? "REMOTE" : jobType === 2 ? "HYBRID" : "ONSITE",
    };

    const sendRequest = () =>
      axios.post("/api/job", payload, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      });

    try {
      setSubmitting(true);
      const res = await sendRequest();
      dispatch(setSuccessMessage(res.data.message));
      router.push("/admin/manage");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        try {
          await refreshTokens();

          const newRes = await sendRequest();
          dispatch(setSuccessMessage(newRes.data.message));
          router.push("/admin/manage");
        } catch (newError) {
          if (axios.isAxiosError(newError)) {
            dispatch(setErrorMessage(newError?.response?.data.error));
          }
          console.log("Unable to create job: ", newError);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full p-8 bg-base-200 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Create a New Job Listing</h1>
        <p>
          Would you like to post a new job listing? Fill in the required details
          such as the job title, description, location, company to proceed.
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
        isLoading={submitting}
      />
    </div>
  );
}
