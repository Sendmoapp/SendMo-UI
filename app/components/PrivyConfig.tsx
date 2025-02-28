"use client";
import { PrivyProvider } from "@privy-io/react-auth";

import { mainnet, sepolia } from "viem/chains";

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
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/assets/logo.jpeg",
        },

        fundingMethodConfig: {
          moonpay: {
            paymentMethod: "credit_debit_card",
            useSandbox: true,
          },
        },

        defaultChain: sepolia,
        supportedChains: [sepolia, mainnet],
        embeddedWallets: {
          showWalletUIs: true,
          priceDisplay: { primary: "fiat-currency", secondary: "native-token" },
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyConfig;
