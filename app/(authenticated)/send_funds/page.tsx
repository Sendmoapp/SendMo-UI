"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import TransactionHistory from "@/app/components/TransactionHistory";
import BackButton from "@/app/components/BackButton";

const SendFunds = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  return (
    <div className="w-full mx-auto">
      {/* Back Button */}
      <BackButton />
      {/* Main Content */}
      <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)">
        <h1 className="text-2xl font-semibold text-[#111827] mb-6">
          Send Money
        </h1>
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by wallet address, email, or username"
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

        <div className="bg-[#F9FAFB]  p-4 ] rounded-[24px] border border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">
              Amount to Send
            </p>
            <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">
              Balance: 1,234.56 USDC
            </p>
          </div>
          <div className="flex items-center justify-between border rounded-xl p-4">
            <Select defaultValue="usd" onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-[115px] h-[48px] border-none bg-white p-2 rounded-[8px]">
                <SelectValue asChild>
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        selectedCurrency === "usd"
                          ? "/assets/dollar.png"
                          : selectedCurrency === "usdc"
                          ? "/assets/usdc.png"
                          : "/assets/usdt.png"
                      }
                      alt={
                        selectedCurrency === "usd"
                          ? "USD"
                          : selectedCurrency === "usdc"
                          ? "USDC"
                          : "USDT"
                      }
                      width={32}
                      height={32}
                    />
                    <span>{selectedCurrency?.toUpperCase()}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/dollar.png"
                      alt="USD"
                      width={24}
                      height={24}
                    />
                    <span>USD</span>
                  </div>
                </SelectItem>
                <SelectItem value="usdc">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/usdc.png"
                      alt="USDC"
                      width={24}
                      height={24}
                    />
                    <span>USDC</span>
                  </div>
                </SelectItem>
                <SelectItem value="usdt">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/usdt.png"
                      alt="USDT"
                      width={24}
                      height={24}
                    />
                    <span>USDT</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <input
              type="number"
              placeholder="0.00"
              className="text-right text-2xl font-bold text-[#6B7280] w-1/2 focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <p className="text-base font-normal text-[#9CA3AF] mt-[10px]">
            ≈ 0.00 USD
          </p>
        </div>
        <button className="w-full bg-[#0172E6] text-white rounded-xl py-3 my-4">
          Confirm Payment
        </button>
        {/* Fee Information */}
        <div className="space-y-4  bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] p-4">
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280] font-normal text-base">
              Network Fee
            </span>
            <span className="text-[#111827] text-base font-semibold">
              $0.00
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280] font-normal text-base">
              Total Amount
            </span>
            <span className="text-[#111827] text-base font-semibold">
              $0.00
            </span>
          </div>
        </div>
      </div>

      <TransactionHistory />
    </div>
  );
};

export default SendFunds;
