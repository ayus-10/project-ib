import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ReduxProvider from "@/providers/ReduxProvider";
import ToastAlert from "@/components/ToastAlert";
import AuthGuard from "@/guards/AuthGuard";
import AdminGuard from "@/guards/AdminGuard";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "iBerozgar",
  description:
    "A Job Listings Application where users can browse jobs, view details, and apply for positions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html lang="en">
        <body>
          <NextTopLoader color="#4a00ff" />
          <NavBar />
          <AuthGuard>
            <AdminGuard>
              <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
            </AdminGuard>
          </AuthGuard>
          <ToastAlert />
        </body>
      </html>
    </ReduxProvider>
  );
}
