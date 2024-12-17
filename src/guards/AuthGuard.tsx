"use client";

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

  const isProtectedPage = pathname.startsWith("/admin");

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
    return (
      <div className="h-[calc(100vh-4rem)] grid place-content-center">
        <span className="loading loading-ring w-40 -mt-16"></span>
      </div>
    );
  }

  if (authenticated === true) {
    return children;
  }

  return null;
}
