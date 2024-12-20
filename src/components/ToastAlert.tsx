"use client";

import { ERROR, SUCCESS } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeAlertMessage } from "@/redux/slices/alertSlice";
import { useEffect } from "react";

export default function ToastAlert() {
  const { message, status } = useAppSelector((state) => state.alert);

  const successIconPath = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
  const errorIconPath =
    "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";

  const dispatch = useAppDispatch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(removeAlertMessage());
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [message, status, dispatch]);

  if (message && status)
    return (
      <div className="toast">
        <div
          className={`alert text-white alert-info ${
            status === ERROR ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={status === SUCCESS ? successIconPath : errorIconPath}
            />
          </svg>

          <span>{message}</span>
        </div>
      </div>
    );
}
