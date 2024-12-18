"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Admin() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/admin") router.push("/admin/create");
  }, [router, pathname]);
  return <LoadingSpinner />;
}
