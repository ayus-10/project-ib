"use client";

import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = [
    { title: "Create Job", path: "/admin/create" },
    { title: "Manage Jobs", path: "/admin/manage" },
    { title: "View Applicants", path: "/admin/applicants" },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="my-drawer-2"
          className="lg:hidden absolute left-2 -top-[3.5rem]"
        >
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
        </label>

        {children}
      </div>
      <div className="drawer-side border-r shadow-md border-base-300">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4">
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
