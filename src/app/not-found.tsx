"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="hero bg-base-200 min-h-[calc(100vh-4rem)]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">404 Not Found</h1>
          <p className="py-6">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.
          </p>
          <button className="btn btn-primary" onClick={() => router.push("/")}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
