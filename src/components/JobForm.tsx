import { JobListing } from "@/interfaces/JobListing";
import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useEffect,
} from "react";

interface JobFormProps {
  titleRef: RefObject<HTMLInputElement | null>;
  companyRef: RefObject<HTMLInputElement | null>;
  locationRef: RefObject<HTMLInputElement | null>;
  deadlineRef: RefObject<HTMLInputElement | null>;
  descriptionRef: RefObject<HTMLTextAreaElement | null>;
  handleSubmit: (e: FormEvent) => Promise<void>;
  jobType: number | null;
  setJobType: Dispatch<SetStateAction<number | null>>;
  defaultValues?: JobListing;
}

export default function JobForm(props: JobFormProps) {
  const {
    companyRef,
    deadlineRef,
    descriptionRef,
    locationRef,
    titleRef,
    handleSubmit,
    jobType,
    setJobType,
    defaultValues,
  } = props;

  const getTypeNumber = (type: string | undefined) =>
    type === "REMOTE"
      ? 1
      : type === "HYBRID"
      ? 2
      : type === "ONSITE"
      ? 3
      : undefined;

  useEffect(() => {
    if (!defaultValues) return;
    const typeNumber = getTypeNumber(defaultValues.type);
    setJobType(typeNumber ?? 0);
  }, [defaultValues]);

  return (
    <form className="flex flex-col gap-2 py-8" onSubmit={handleSubmit}>
      <label className="input input-bordered flex items-center gap-2">
        Job title
        <input
          ref={titleRef}
          type="text"
          className="grow"
          placeholder="Professional sleeper"
          defaultValue={defaultValues?.title}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        Company
        <input
          ref={companyRef}
          type="text"
          className="grow"
          placeholder="Sleepers Inc."
          defaultValue={defaultValues?.company}
        />
      </label>
      <select
        className="select select-bordered w-full"
        value={getTypeNumber(defaultValues?.type) ?? jobType ?? 0}
        onChange={(e) => setJobType(parseInt(e.target.value))}
      >
        <option value={0} disabled>
          Job type
        </option>
        <option value={1}>Remote</option>
        <option value={2}>Hybrid</option>
        <option value={3}>On-site</option>
      </select>
      <label
        className={`input input-bordered items-center gap-2 ${
          jobType === 2 || jobType === 3 ? "flex" : "hidden"
        }`}
      >
        Location
        <input
          ref={locationRef}
          type="text"
          className="grow"
          placeholder="United States of Disneyland"
          defaultValue={defaultValues?.location}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        Deadline
        <input
          ref={deadlineRef}
          type="date"
          className="grow"
          defaultValue={defaultValues?.deadline.split("T")[0]}
        />
      </label>
      <textarea
        ref={descriptionRef}
        className="textarea textarea-bordered min-h-60"
        placeholder="Job description..."
        defaultValue={defaultValues?.description}
      ></textarea>
      <button className="btn btn-primary max-w-xs">Submit</button>
    </form>
  );
}
