"use client";

import { getUserBalance } from "@/app/server_actions/accountActions";
import { userAccountAtom } from "@/app/state/atoms";
import { Skeleton } from "@/components/ui/skeleton";
import useAccount from "@/hooks/use-account";
import { useToast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UserBal {
  usd: string | undefined;
  usdc: string | undefined;
  eth: string | undefined;
  ethUsd: number | undefined;
  mpt: string | undefined;
  totalCryptoBal: string | undefined;
}
const BalanceAndPrices = () => {
  const [userbal, setuserbal] = useState<UserBal | null>(null);
  const { currentChain, embeddedWallet } = useAccount();
  const [_, setUserBalances] = useAtom(userAccountAtom);
  const { toast } = useToast();
  const [fetching, setFetching] = useState(false);

  const fetchUserWalletBalance = async () => {
    setFetching(true);

    if (!embeddedWallet) throw new Error("No embedded wallet found");
    try {
      const response = await getUserBalance(
        embeddedWallet?.address!,
        "0xaa36a7"
      );
      if (response.success) {
        setuserbal({
          usd: response.usdtBalance,
          usdc: response.usdcBalance,
          totalCryptoBal: response.totalBalanceUSD,
          eth: response.ethBalance,
          ethUsd: response.ethInUsd,
          mpt: response.mptBalance,
        });
        setUserBalances({
          ethBalance: parseFloat(response.ethBalance ?? "0"),
          totalCryptoBalance: parseFloat(response.totalBalanceUSD ?? "0"),
          usdcBalance: parseFloat(response.usdcBalance ?? "0"),
          usdtBalance: parseFloat(response.usdtBalance ?? "0"),
          mptBalance: parseFloat(response.mptBalance ?? "0"),
        });
      } else {
        toast({
          title: "Error fetching data",
          variant: "destructive",
          description: "Please try again",
        });
      }
    } catch (error) {
      console.error("Error fetching user wallet balance:", error);
      toast({
        title: "Error fetching balance",
        variant: "destructive",
        description: "Please try again",
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!embeddedWallet) return;

    fetchUserWalletBalance();
  }, [currentChain, embeddedWallet]);
  return (
    <div className="bg-bg-dashboard-element bg-cover border border-white rounded-[24px] p-6 shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)]">
      {fetching ? (
        <div className="grid grid-cols-2 gap-2 mb-6">
          <Skeleton className="w-[400px] h-[80px] rounded-[16px]" />
          <Skeleton className="w-[400px] h-[80px] rounded-[16px]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[rgba(249,250,251,0.5)] px-6 py-4 rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.12)] border-[2px] border-white">
            <p className="text-[#6B7280] font-normal text-base mb-[10px]">
              Total ETH Balance
            </p>
            <h2 className="text-3xl font-bold">
              ETH {parseFloat(userbal?.eth ?? "0").toFixed(6)}
            </h2>
          </div>
          <div className="bg-[rgba(249,250,251,0.5)] px-6 py-4 rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.12)] border-[2px] border-white">
            <p className="text-[#6B7280] font-normal text-base mb-[10px]">
              Total Crypto Balance
            </p>
            <h2 className="text-3xl font-bold">
              ${userbal?.totalCryptoBal ?? "N/A"}
            </h2>
          </div>
        </div>
      )}

      {/* Stablecoin Balances */}

      {fetching ? (
        <div className="grid grid-cols-4 gap-6">
          <Skeleton className="w-[100px] h-[100px] rounded-[4px]" />
          <Skeleton className="w-[100px] h-[100px] rounded-[4px]" />
          <Skeleton className="w-[100px] h-[100px] rounded-[4px]" />
          <Skeleton className="w-[100px] h-[100px] rounded-[4px]" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {[
            {
              icon: "/assets/eth.svg",
              symbol: "ETH",
              amount: parseFloat(userbal?.eth ?? "0").toFixed(6),
              usdAmount: userbal?.ethUsd,
            },
            {
              icon: "/assets/usdc.png",
              symbol: "USDC",
              amount: userbal?.usdc,
              usdAmount: userbal?.usdc,
            },
            {
              icon: "/assets/usdt.png",
              symbol: "USDT",
              amount: userbal?.usd,
              usdAmount: userbal?.usd,
            },
            {
              icon: "/assets/moonpay.png",
              symbol: "MPT",
              amount: userbal?.mpt,
              usdAmount: userbal?.mpt,
            },

            // {
            //   icon: "/assets/dai.avif",
            //   symbol: "DAI",
            //   amount: "789.10",
            //   usdAmount: "789.10",
            // },
          ].map((coin) => (
            <div
              key={coin.symbol}
              className="p-4 flex flex-col items-center justify-center rounded-xl bg-opacity-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src={coin.icon}
                  alt={coin.symbol}
                  width={32}
                  height={32}
                />
                <span className="text-[#9CA3AF] font-medium text-base">
                  {coin.symbol}
                </span>
              </div>
              <p className="text-2xl font-bold mb-2">{coin.amount}</p>
              <p className="text-sm text-[#6B7280] font-normal ">
                ≈ ${Math.floor(Number(coin.usdAmount)).toFixed(2)} USD
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BalanceAndPrices;
