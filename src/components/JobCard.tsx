import { ACCESS_TOKEN } from "@/constants";
import { JobListingWithFavorite } from "@/interfaces/JobListing";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage, setSuccessMessage } from "@/redux/slices/alertSlice";
import refreshTokens from "@/requests/refreshTokens";
import { formattedDate, formattedLocation } from "@/utils/formatJobDetails";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { GoStar, GoStarFill } from "react-icons/go";
import { RiBuilding2Fill } from "react-icons/ri";
import { TbClockHour10Filled, TbClockHour2Filled } from "react-icons/tb";

const POST = "POST";
const DELETE = "DELETE";

export default function JobCard({ job }: { job: JobListingWithFavorite }) {
  const [currentJob, setCurrentJob] = useState(job);

  const dispatch = useAppDispatch();

  const router = useRouter();

  function sendFavoriteRequest(method: "POST" | "DELETE") {
    const url = "/api/favorite?jobId=" + currentJob.id;
    const config = {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    };
    return method === "POST"
      ? axios.post(url, undefined, config)
      : axios.delete(url, config);
  }

  async function addFavorite() {
    try {
      const res = await sendFavoriteRequest(POST);
      setCurrentJob((prev) => {
        return { ...prev, isFavorite: true };
      });
      dispatch(setSuccessMessage(res.data.message));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        try {
          await refreshTokens();
          const newRes = await sendFavoriteRequest(POST);
          setCurrentJob((prev) => {
            return { ...prev, isFavorite: true };
          });
          dispatch(setSuccessMessage(newRes.data.message));
        } catch (newError) {
          if (axios.isAxiosError(newError)) {
            dispatch(setErrorMessage(newError?.response?.data.error));
          }
        }
      }
    }
  }

  async function removeFavorite() {
    try {
      const res = await sendFavoriteRequest(DELETE);
      setCurrentJob((prev) => {
        return { ...prev, isFavorite: false };
      });
      dispatch(setSuccessMessage(res.data.message));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        try {
          await refreshTokens();
          const newRes = await sendFavoriteRequest(DELETE);
          setCurrentJob((prev) => {
            return { ...prev, isFavorite: false };
          });
          dispatch(setSuccessMessage(newRes.data.message));
        } catch (newError) {
          if (axios.isAxiosError(newError)) {
            dispatch(setErrorMessage(newError?.response?.data.error));
          }
        }
      }
    }
  }

  return (
    <div className="card my-4 mx-auto bg-base-100 shadow-xl w-64 sm:w-80 md:w-[36rem] lg:w-[40rem]">
      <div className="card-body">
        <h2 className="card-title">{currentJob.title}</h2>
        <span className="font-semibold text-sm md:text-base flex items-center gap-1">
          <span className="flex-shrink-0">
            <RiBuilding2Fill />
          </span>
          <span>{currentJob.company}</span>
        </span>
        <span className="font-semibold text-sm md:text-base flex items-center gap-1">
          <span className="flex-shrink-0">
            <FaLocationDot />
          </span>
          <span>{formattedLocation(currentJob.location, currentJob.type)}</span>
        </span>
        <span className="font-semibold text-sm md:text-base flex items-center gap-1">
          <span className="flex-shrink-0">
            <TbClockHour2Filled />
          </span>
          <span>Listed {formattedDate(currentJob.created)}</span>
        </span>
        <span className="font-semibold text-sm md:text-base flex items-center gap-1">
          <span className="flex-shrink-0">
            <TbClockHour10Filled />
          </span>
          <span>Deadline {formattedDate(currentJob.deadline)}</span>
        </span>
        <p className="line-clamp-4 text-sm md:text-base">
          {currentJob.description}
        </p>
        <div className="card-actions justify-end">
          <button
            className="btn"
            onClick={() =>
              currentJob.isFavorite ? removeFavorite() : addFavorite()
            }
          >
            {currentJob.isFavorite ? <GoStarFill /> : <GoStar />}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/job?id=" + currentJob.id)}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
