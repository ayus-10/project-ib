"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import useAuthentication from "@/hooks/useAuthentication";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage } from "@/redux/slices/alertSlice";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isProtectedPage =
    pathname.startsWith("/admin") || pathname.startsWith("/job");

  const router = useRouter();

  const dispatch = useAppDispatch();

  const authenticated = useAuthentication();

  useEffect(() => {
    if (isProtectedPage && authenticated === false) {
      dispatch(setErrorMessage("Only logged in users can visit this page."));
      router.push("/");
    }
  }, [authenticated, router, isProtectedPage, dispatch]);

  if (!isProtectedPage) {
    return children;
  }

  if (authenticated === undefined) {
    return <LoadingSpinner />;
  }

  if (authenticated === true) {
    return children;
  }

  return null;
}
