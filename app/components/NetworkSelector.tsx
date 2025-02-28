"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

import useAccount from "@/hooks/use-account";
import { Loader2 } from "lucide-react";
import { baseSepolia, sepolia } from "viem/chains";

export const chains = [
  // {
  //   ...mainnet,
  //   icon: "/icons/networks/eth.svg",
  // },
  {
    ...sepolia,
    icon: "/icons/networks/eth.svg",
  },

  // {
  //   ...base,
  //   icon: "/icons/networks/base.svg",
  // },
  // {
  //   ...baseSepolia,
  //   icon: "/icons/networks/base.svg",
  // },
];

const NetworkSelector = () => {
  const { currentChain, switchNetwork, switchingTo, isLoading } = useAccount();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          disabled={isLoading}
          className="flex items-center gap-2 bg-[#F9FAFB] py-2 px-3 rounded-[12px] border border-[#E5E7EB] disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Image
              src={currentChain.icon}
              alt={currentChain.name}
              width={20}
              height={20}
            />
          )}
          <span className="text-sm font-medium text-[#111827]">
            {isLoading ? "Switching..." : currentChain.name}
          </span>
          <Image
            src="/icons/arrow-down-s-fill.svg"
            alt="arrow-down"
            width={16}
            height={16}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Network</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {chains.map((chain) => (
            <button
              key={chain.id}
              onClick={() => switchNetwork(chain)}
              disabled={isLoading}
              className={`flex items-center gap-3 p-3 rounded-[12px] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 ${
                currentChain.id === chain.id
                  ? "bg-[#F5F9FF] border-[#0172E6] border"
                  : "border border-[#E5E7EB]"
              }`}
            >
              {switchingTo === chain.id ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="relative">
                  <Image
                    src={chain.icon}
                    alt={chain.name}
                    width={24}
                    height={24}
                    className={
                      chain.id === sepolia.id || chain.id === baseSepolia.id
                        ? "opacity-60"
                        : ""
                    }
                  />
                  {chain.id === sepolia.id ||
                    (chain.id === baseSepolia.id && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
                    ))}
                </div>
              )}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-[#111827]">
                  {chain.name}
                </span>
                <span className="text-xs text-[#6B7280]">
                  {chain.id === sepolia.id || chain.id === baseSepolia.id
                    ? "Testnet"
                    : "Mainnet"}
                </span>
              </div>
              {currentChain.id === chain.id && (
                <div className="ml-auto">
                  <div className="w-2 h-2 rounded-full bg-[#0172E6]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkSelector;
