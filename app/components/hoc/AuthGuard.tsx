"use client";

import { usePrivy } from "@privy-io/react-auth";
// import { redirect } from "next/navigation";
import { useEffect } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    // if (!authenticated && !ready) redirect("/");
  }, [ready, authenticated]);

  return <div>{children}</div>;
};

export default AuthGuard;
