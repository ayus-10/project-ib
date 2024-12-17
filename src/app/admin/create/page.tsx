"use client";

import { ACCESS_TOKEN } from "@/constants";
import { CreateJobDTO } from "@/interfaces/CreateJobDTO";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage, setSuccessMessage } from "@/redux/slices/alertSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

export default function Create() {
  const [jobTypeId, setJobTypeId] = useState<null | number>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const deadlineInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const dispatch = useAppDispatch();

  const router = useRouter();

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

    if (!jobTypeId || ![1, 2, 3].includes(jobTypeId)) {
      return;
    }

    const payload: CreateJobDTO = {
      title: titleInputRef.current.value,
      company: companyInputRef.current.value,
      location: locationInputRef.current.value,
      description: descriptionInputRef.current.value,
      deadline: new Date(deadlineInputRef.current.value).toISOString(),
      created: new Date().toISOString(),
      type: jobTypeId === 1 ? "REMOTE" : jobTypeId === 2 ? "HYBRID" : "ONSITE",
    };

    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      await axios.post("/api/job", payload, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(setSuccessMessage("Successfully created the job listing."));
      router.push("/admin/manage");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error?.response?.data.error));
      }
      console.log("Unable to create job: ", error);
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
      <form className="flex flex-col gap-2 py-8" onSubmit={handleSubmit}>
        <label className="input input-bordered flex items-center gap-2">
          Job title
          <input
            ref={titleInputRef}
            type="text"
            className="grow"
            placeholder="Professional sleeper"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          Company
          <input
            ref={companyInputRef}
            type="text"
            className="grow"
            placeholder="Sleepers Inc."
          />
        </label>
        <select
          className="select select-bordered w-full"
          value={jobTypeId ?? 0}
          onChange={(e) => setJobTypeId(parseInt(e.target.value))}
        >
          <option value={0} disabled>
            Job type
          </option>
          <option value={1}>Remote</option>
          <option value={2}>Hybrid</option>
          <option value={3}>On-site</option>
        </select>
        {jobTypeId !== 0 ? (
          <label className="input input-bordered flex items-center gap-2">
            Location
            <input
              ref={locationInputRef}
              type="text"
              className="grow"
              placeholder="United States of Disneyland"
            />
          </label>
        ) : null}
        <label className="input input-bordered flex items-center gap-2">
          Deadline
          <input ref={deadlineInputRef} type="date" className="grow" />
        </label>
        <textarea
          ref={descriptionInputRef}
          className="textarea textarea-bordered"
          placeholder="Job description..."
        ></textarea>
        <button className="btn btn-primary max-w-xs">Submit</button>
      </form>
    </div>
  );
}
