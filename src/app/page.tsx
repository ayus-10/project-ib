"use client";

import useAuthentication from "@/hooks/useAuthentication";

export default function Home() {
  useAuthentication();

  return <div></div>;
}
