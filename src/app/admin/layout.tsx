"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { title: "Create Job", path: "/admin/create" },
    { title: "Manage Jobs", path: "/admin/manage" },
    { title: "View Applicants", path: "/admin/applicants" },
  ];

  useEffect(() => {
    if (pathname === "/admin") router.push("/admin/create");
  }, [router, pathname]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="my-drawer-2"
          className="flex items-center gap-1 btn drawer-button lg:hidden bg-transparent border-transparent hover:bg-transparent hover:border-transparent focus:bg-transparent focus:border-transparent text-base"
        >
          <span>Options</span>
          <FaChevronRight />
        </label>

        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-300 text-base-content min-h-full w-80 p-4">
          {links.map((link) => (
            <li key={link.path}>
              <Link href={link.path}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
