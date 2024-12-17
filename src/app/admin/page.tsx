"use client";

import { ADMIN } from "@/constants";
import useAuthentication from "@/hooks/useAuthentication";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setErrorMessage } from "@/redux/slices/alertSlice";
import { areAllNull, areAllUndefined } from "@/utils/checkValues";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Admin() {
  useAuthentication();

  const { email, fullName, role } = useAppSelector(
    (state) => state.authenticatedUser
  );

  const router = useRouter();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (areAllNull(email, fullName, role) || role !== ADMIN) {
      router.push("/");
      dispatch(setErrorMessage("Only admins can visit this page."));
    }
  }, [email, fullName, role, router]);

  if (areAllUndefined(email, fullName, role))
    return (
      <div className="h-[calc(100vh-4rem)] grid place-content-center">
        <span className="loading loading-ring w-40 -mt-16"></span>
      </div>
    );
}
