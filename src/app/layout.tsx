import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ReduxProvider from "@/providers/ReduxProvider";
import ToastAlert from "@/components/ToastAlert";
import AuthGuard from "@/guards/AuthGuard";
import AdminGuard from "@/guards/AdminGuard";

export const metadata: Metadata = {
  title: "iBerozgar",
  description: "Where berozgari shines!",
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
          <NavBar />
          <AuthGuard>
            <AdminGuard>{children}</AdminGuard>
          </AuthGuard>
          <ToastAlert />
        </body>
      </html>
    </ReduxProvider>
  );
}
