"use client";

import { ADMIN } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setErrorMessage } from "@/redux/slices/alertSlice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const dispatch = useAppDispatch();

  const router = useRouter();

  const isAdminOnlyPage = pathname.startsWith("/admin");

  const isAdmin =
    useAppSelector((state) => state.authenticatedUser.role) === ADMIN;

  useEffect(() => {
    if (isAdminOnlyPage && !isAdmin) {
      dispatch(setErrorMessage("Only admins can visit this page."));
      router.push("/");
    }
  }, [isAdminOnlyPage, isAdmin, router, dispatch]);

  if (!isAdminOnlyPage || isAdmin) return children;

  return null;
}
