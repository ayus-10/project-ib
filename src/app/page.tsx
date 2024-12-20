"use client";

import JobCard from "@/components/JobCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ACCESS_TOKEN } from "@/constants";
import { JobListingWithFavorite } from "@/interfaces/JobListing";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage } from "@/redux/slices/alertSlice";
import refreshTokens from "@/requests/refreshTokens";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  const [jobs, setJobs] = useState<JobListingWithFavorite[]>([]);

  const [favoritesFilter, setFavoritesFilter] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getJobs() {
      try {
        await refreshTokens();
        const res = await axios.get(
          "/api/job/all?pageNumber=" + 5 * (currentPage - 1),
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
            },
          }
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

  function handleFilter(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "1") setFavoritesFilter(true);
    setFavoritesFilter(false);
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center p-2">
      <select
        className="select select-bordered ml-auto"
        onChange={(e) => handleFilter(e)}
      >
        <option value={1}>All jobs</option>
        <option value={2}>Favorites</option>
      </select>
      <div className="grow">
        {favoritesFilter
          ? jobs
              .filter((jobs) => jobs.isFavorite)
              .map((j) => <JobCard job={j} key={j.id} />)
          : jobs.map((j) => <JobCard job={j} key={j.id} />)}
        {jobs.length === 0 ? <LoadingSpinner /> : null}
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
