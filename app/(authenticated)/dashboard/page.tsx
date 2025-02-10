"use client";
import TransactionHistory from "@/app/components/TransactionHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const DashboardPage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [selectedCurrencyTo, setSelectedCurrencyTo] = useState("usdc");

  return (
    <div className="max-w-[1440px] mx-auto p-6 space-y-6 ">
      {/* Balance Cards */}
      <div className="bg-bg-dashboard-element bg-cover border border-white rounded-[24px] p-6 shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[rgba(249,250,251,0.5)] px-6 py-4 rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.12)] border-[2px] border-white">
            <p className="text-[#6B7280] font-normal text-base mb-[10px]">
              Total USD Balance
            </p>
            <h2 className="text-3xl font-bold">$10,000.00</h2>
          </div>
          <div className="bg-[rgba(249,250,251,0.5)] px-6 py-4 rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.12)] border-[2px] border-white">
            <p className="text-[#6B7280] font-normal text-base mb-[10px]">
              Total Crypto Balance
            </p>
            <h2 className="text-3xl font-bold">$5,048.33</h2>
          </div>
        </div>

        {/* Stablecoin Balances */}
        <div className="grid grid-cols-4 gap-6">
          {[
            {
              icon: "/assets/usdc.png",
              symbol: "USDC",
              amount: "1,234.56",
              usdAmount: "1,234.56",
            },
            {
              icon: "/assets/usdt.png",
              symbol: "USDT",
              amount: "2,456.78",
              usdAmount: "2,456.78",
            },
            {
              icon: "/assets/solana.png",
              symbol: "FDUSD",
              amount: "567.89",
              usdAmount: "567.89",
            },
            {
              icon: "/assets/binance.png",
              symbol: "BUSD",
              amount: "789.10",
              usdAmount: "789.10",
            },
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
                ≈ ${coin.usdAmount} USD
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-white border border-[#E5E7EB] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08) rounded-[24px]">
        <Link
          href="/send_funds"
          className="flex flex-col items-center justify-center gap-3 bg-[#0172E6] text-white p-4 h-[92px] rounded-[16px]"
        >
          <Image src="/assets/Path@1x.png" alt="Send" width={20} height={20} />
          <span>Send</span>
        </Link>
        <Link
          href="/receive_funds"
          className="flex flex-col items-center justify-center gap-3 bg-[#F9FAFB] text-[#0172E6] text-base font-normal p-4 h-[92px] rounded-xl border border-[#E5E7EB]"
        >
          <Image
            src="/assets/receive.png"
            alt="Receive"
            width={20}
            height={20}
          />
          <span>Receive</span>
        </Link>
        <Link
          href="/add_funds"
          className="flex flex-col items-center justify-center gap-3 bg-[#F9FAFB] text-[#0172E6] text-base font-normal p-4 h-[92px] rounded-xl border border-[#E5E7EB]"
        >
          <Image
            src="/assets/add_icon.png"
            alt="Add Funds"
            width={20}
            height={20}
          />
          <span>Add Funds</span>
        </Link>
      </div>

      {/* Convert Asset Form */}
      <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)">
        <h3 className="text-2xl font-semibold mb-4">Convert Asset</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#F9FAFB]  p-4 ] rounded-[24px] border border-[#E5E7EB]">
            <div className="flex justify-between items-center">
              <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">
                From
              </p>
              <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">
                Balance: $10,000.00
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
          </div>
          <div className="bg-[#F9FAFB]  p-4 ] rounded-[24px] border border-[#E5E7EB]">
            <div className="flex justify-between items-center">
              <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">
                To
              </p>
              <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">
                1 USDC = $1.00
              </p>
            </div>

            <div className="flex items-center justify-between border rounded-xl p-4">
              <Select
                value={selectedCurrencyTo}
                onValueChange={setSelectedCurrencyTo}
              >
                <SelectTrigger className="w-[115px] h-[48px] border-none bg-white p-2 rounded-[8px]">
                  <SelectValue placeholder="Select currency" />
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
          </div>
        </div>
        <button className="w-full bg-[#0172E6] text-white rounded-xl py-3 mt-4">
          Convert to {selectedCurrencyTo.toUpperCase()}
        </button>
      </div>

      {/* Recent Transactions */}
      <TransactionHistory />
    </div>
  );
};

export default DashboardPage;
