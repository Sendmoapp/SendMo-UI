"use client";
import BackButton from "@/app/components/BackButton";
import TransactionHistory from "@/app/components/TransactionHistory";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const ReceiveFundsPage = () => {
  const { user, ready, authenticated } = usePrivy();
  const [walletAddress, setwalletAddress] = useState("");

  useEffect(() => {
    if (authenticated && ready) setwalletAddress(user?.wallet?.address ?? "");
  }, [ready, authenticated]);
  return (
    <div className="w-full mx-auto">
      {/* Back Button */}
      <BackButton />

      {/* Main Content */}
      <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)">
        <h1 className="text-2xl font-semibold text-[#111827] mb-6">
          Receive Money
        </h1>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Your receiving wallet address"
              readOnly
              className="w-full rounded-[14px] border border-[#D4D4D8] p-4 bg-[#F9FAFB]"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Image
                src="/icons/search.svg"
                alt="Search"
                width={18}
                height={18}
              />
            </button>
          </div>
        </div>

        {/* USDC Address */}
        <div className="mb-6 bg-[#F9FAFB] rounded-[24px] p-4">
          <label className="text-base font-normal text-[#6B7280] mb-2 block">
            Your USDC Address
          </label>
          <input
            type="text"
            value={walletAddress}
            readOnly
            className="w-full rounded-[14px] border border-[#E5E7EB] p-4 bg-white"
          />
        </div>

        {/* QR Code */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] p-8 flex flex-col items-center mb-6">
          <div className="p-4 bg-white rounded-[8px] border border-[#E5E7EB]">
            <QRCode value={walletAddress} size={200} />
          </div>
          <p className="text-sm font-normal text-[#6B7280] mt-4">
            Scan this QR code to get your address
          </p>
        </div>

        {/* Share Button */}
        <button className="w-full bg-[#0172E6] text-white rounded-[12px] py-3 px-4 flex items-center justify-center gap-2 mb-6">
          <Image src="/icons/share.svg" alt="Share" width={20} height={20} />
          Share Address
        </button>
      </div>
      <TransactionHistory />
    </div>
  );
};

export default ReceiveFundsPage;
