import { chains } from "@/app/components/NetworkSelector";
import { useWallets } from "@privy-io/react-auth";
import React from "react";
import { useToast } from "./use-toast";

const useAccount = () => {
  const [currentChain, setCurrentChain] = React.useState(chains[0]);
  const [switchingTo, setSwitchingTo] = React.useState<number | null>(null);
  const { wallets, ready } = useWallets();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  if (!ready) {
    return {
      currentChain,
      setCurrentChain,
      switchNetwork: () => {},
      setSwitchingTo,
      isLoading,
      switchingTo,
      embeddedWallet: null,
    };
  }
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  if (!embeddedWallet) {
    throw new Error("No embedded wallet found");
  }
  const switchNetwork = async (chain: any) => {
    try {
      setIsLoading(true);
      setSwitchingTo(chain.id);
      await embeddedWallet?.switchChain(parseInt(chain.id));
      setCurrentChain(chain);
      toast({
        title: "Network Changed",
        description: `Successfully switched to ${chain.name}`,
      });
    } catch (error: any) {
      console.error("Error switching network:", error);
      toast({
        variant: "destructive",
        title: "Error Switching Network",
        description: error?.message || "Failed to switch network",
      });
    } finally {
      setSwitchingTo(null);
      setIsLoading(false);
    }
  };

  return {
    currentChain,
    setCurrentChain,
    switchNetwork,
    setSwitchingTo,
    isLoading,
    switchingTo,
    embeddedWallet,
  };
};
export default useAccount;
