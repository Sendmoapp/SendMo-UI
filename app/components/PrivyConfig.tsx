"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import React from "react";

if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID)
  throw new Error("PRIVY APP ID IS NOT AVAILABLE");
const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

const PrivyConfig = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["google", "wallet", "email"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/assets/logo.png",
        },

        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyConfig;
