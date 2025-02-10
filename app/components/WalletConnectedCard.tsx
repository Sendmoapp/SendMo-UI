"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import React from "react";

const WalletConnectedCard = () => {
  const { user } = usePrivy();
  const router = useRouter();
  console.log({ user });
  const handleClick = () => {
    router.push("/auth/set-up");
  };
  return (
    <div className="w-full max-w-[600px] rounded-[40px] bg-white p-10 shadow-lg backdrop-blur-xl flex flex-col items-center z-10 mb-[100px]">
      <p className="text-[40px] font-bold text-center mb-2">Wallet Connected</p>
      <p className="text-[18px] font-normal text-[#4B5563] mb-10">
        proceed to dashboard
      </p>
      <div className="flex items-center gap-4 bg-[#E5E7EB] py-3 px-4 rounded-[18px] mb-10">
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <img
            src="/assets/wallet icon.svg"
            alt="Wallet Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-[#0A0A0B]">
            {user?.wallet?.address?.slice(0, 6)}****
            {user?.wallet?.address?.slice(-4)}
          </span>
        </div>
      </div>
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-center py-2 text-white bg-[#0172E6] border rounded-[8px] hover:text-grey-200 gap-2 text-sm font-medium mb-4"
      >
        Continue
      </button>
    </div>
  );
};

export default WalletConnectedCard;
