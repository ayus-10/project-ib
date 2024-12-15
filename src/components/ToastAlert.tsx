"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeAlertMessage } from "@/redux/slices/alertSlice";
import { useEffect } from "react";

export default function ToastAlert() {
  const { message, status } = useAppSelector((state) => state.alert);

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
            status === "ERROR" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <span>{message}</span>
        </div>
      </div>
    );
}
