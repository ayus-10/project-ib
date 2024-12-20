import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";

export default function JobLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}
