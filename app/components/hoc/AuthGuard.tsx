"use client";

import { usePrivy } from "@privy-io/react-auth";
import dynamic from "next/dynamic";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

const MoonPayProvider = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayProvider),
  { ssr: false }
);

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { ready, authenticated } = usePrivy();

  const pathName = usePathname();
  useEffect(() => {
    if (!ready) return;

    if (ready && !authenticated) redirect("/auth");
  }, [pathName, ready, authenticated]);

  return (
    <div>
      <MoonPayProvider
        debug={true}
        apiKey={process.env.NEXT_PUBLIC_MOONPAY_PUBLISHABLE_KEY!}
      >
        {children}
      </MoonPayProvider>
    </div>
  );
};

export default AuthGuard;
