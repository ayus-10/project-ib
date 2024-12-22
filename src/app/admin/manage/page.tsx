"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { ACCESS_TOKEN } from "@/constants";
import { JobListing } from "@/interfaces/JobListing";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage, setSuccessMessage } from "@/redux/slices/alertSlice";
import refreshTokens from "@/requests/refreshTokens";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { MdDelete } from "react-icons/md";

interface GetJobListings {
  jobs: JobListing[];
}

export default function Manage() {
  const [createdJobs, setCreatedJobs] = useState<JobListing[]>([]);

  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    async function getJobs() {
      const sendRequest = () =>
        axios.get<GetJobListings>("/api/job/created", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        });

      try {
        setLoading(true);
        const res = await sendRequest();
        setCreatedJobs(res.data.jobs);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          await refreshTokens();
          const newRes = await sendRequest();
          setCreatedJobs(newRes.data.jobs);
        }
        console.log("Unable to fetch jobs: ", error);
      } finally {
        setLoading(false);
      }
    }

    getJobs();
  }, []);

  function handleEdit(id: string) {
    router.push("/admin/edit?id=" + id);
  }

  function handleDelete(id: string) {
    const confirmed = confirm("Really delete this job?");
    if (!confirmed) return;
    deleteJob(id);
  }

  function deleteJob(id: string) {
    axios
      .delete("/api/job?jobId=" + id, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      })
      .then((res) => dispatch(setSuccessMessage(res.data.message)))
      .catch((err) => dispatch(setErrorMessage(err.response.data.error)))
      .finally(() => router.push("/admin"));
  }

  if (!loading)
    return (
      <div className="w-full h-full py-4">
        <div className="overflow-x-auto">
          <table className="table table-zebra md:table-fixed">
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
              {createdJobs.map((job) => (
                <tr key={job.id}>
                  <th>{job.id}</th>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{new Date(job.created).toDateString()}</td>
                  <td>{new Date(job.deadline).toDateString()}</td>
                  <td>
                    <button
                      className="btn text-base btn-sm btn-outline lg:rounded-r-none"
                      onClick={() => handleEdit(job.id)}
                    >
                      <IoMdSettings />
                    </button>
                    <button
                      className="btn text-base btn-sm btn-outline lg:rounded-l-none"
                      onClick={() => handleDelete(job.id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

  return <LoadingSpinner />;
}
