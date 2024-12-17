"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Admin() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/admin") router.push("/admin/create");
  }, [router, pathname]);
  return (
    <div className="h-[calc(100vh-4rem)] grid place-content-center">
      <span className="loading loading-ring w-40 -mt-16"></span>
    </div>
  );
}
