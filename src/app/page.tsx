"use client";

import JobCard from "@/components/JobCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ACCESS_TOKEN } from "@/constants";
import { JobListingWithFavorite } from "@/interfaces/JobListing";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage } from "@/redux/slices/alertSlice";
import refreshTokens from "@/requests/refreshTokens";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  const [loadingJobs, setLoadingJobs] = useState(false);

  const [jobs, setJobs] = useState<JobListingWithFavorite[]>([]);

  const [favoriteJobs, setFavoriteJobs] = useState<JobListingWithFavorite[]>(
    []
  );

  const router = useRouter();

  const searchParams = useSearchParams();

  const [favoritesFilter, setFavoritesFilter] = useState(false);

  useEffect(
    () => router.push("/?favorites=" + favoritesFilter),
    [favoritesFilter, router]
  );

  useEffect(
    () => setFavoritesFilter(searchParams.get("favorites") === "true"),
    [searchParams]
  );

  const dispatch = useAppDispatch();

  const sendRequest = useCallback(
    (endpoint: "all" | "favorites") =>
      axios.get(`/api/job/${endpoint}?pageNumber=${currentPage}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      }),
    [currentPage]
  );

  useEffect(() => {
    async function getJobs() {
      try {
        setLoadingJobs(true);
        await refreshTokens();
        const res = await sendRequest("all");
        setJobs(res.data.jobs);
      } catch (error) {
        setCurrentPage(1);
        if (axios.isAxiosError(error)) {
          dispatch(setErrorMessage(error?.response?.data.error));
        }
        console.log("Unable to fetch for jobs: ", error);
      } finally {
        setLoadingJobs(false);
      }
    }

    getJobs();
  }, [sendRequest, dispatch]);

  useEffect(() => {
    async function getFavoriteJobs() {
      try {
        setLoadingJobs(true);
        await refreshTokens();
        const res = await sendRequest("favorites");
        setFavoriteJobs(res.data.jobs);
      } catch (error) {
        setCurrentPage(1);
        if (axios.isAxiosError(error)) {
          dispatch(setErrorMessage(error?.response?.data.error));
        }
        console.log("Unable to fetch for jobs: ", error);
      } finally {
        setLoadingJobs(false);
      }
    }

    if (favoritesFilter) getFavoriteJobs();
  }, [favoritesFilter, sendRequest, dispatch]);

  if (loadingJobs) return <LoadingSpinner />;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center p-2">
      <select
        className="select select-bordered ml-auto"
        value={favoritesFilter ? 2 : 1}
        onChange={(e) => setFavoritesFilter(e.target.value === "2")}
      >
        <option value={1}>All jobs</option>
        <option value={2}>Favorites</option>
      </select>
      <div className="grow">
        {favoritesFilter
          ? favoriteJobs.map((j) => <JobCard job={j} key={j.id} />)
          : jobs.map((j) => <JobCard job={j} key={j.id} />)}
        {favoritesFilter && favoriteJobs.length === 0 ? (
          <span className="font-semibold">
            No jobs added to favorites list!
          </span>
        ) : null}
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
