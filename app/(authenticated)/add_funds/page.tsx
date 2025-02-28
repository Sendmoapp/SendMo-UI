"use client";
import BackButton from "@/app/components/BackButton";
import TransactionHistory from "@/app/components/TransactionHistory";
import Image from "next/image";
import { useState } from "react";

const AddFundsPage = () => {
  const [amount, setAmount] = useState("0.00");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  const predefinedAmounts = [
    { value: "10", label: "+ $10" },
    { value: "50", label: "+ $50" },
    { value: "100", label: "+ $100" },
    { value: "500", label: "+ $500" },
  ];

  const paymentMethods = [
    { id: "credit", label: "Credit Card", icon: "/icons/Path (1).svg" },
    { id: "bank", label: "Bank Transfer", icon: "/icons/Path (2).svg" },
  ];

  return (
    <div className="w-full mx-auto">
      {/* Back Button */}
      <BackButton />

      {/* Main Content */}
      <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)]">
        <h1 className="text-2xl font-semibold text-[#111827] mb-6">
          Add Funds
        </h1>

        {/* Wallet Address Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Your receiving wallet address"
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

        {/* Amount Input */}
        <div className="mb-6 bg-[#F9FAFB] rounded-[24px] p-4">
          <label className="text-base font-normal text-[#6B7280] mb-2 block">
            Amount (USDC)
          </label>
          <div className="relative rounded-[14px] mb-4 border border-[#E5E7EB]  bg-white">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-[14px] p-4 h-full  text-2xl font-bold text-left focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
              USDC
            </span>
          </div>

          {/* Predefined Amounts */}
          <div className="grid grid-cols-4 gap-4">
            {predefinedAmounts.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setAmount(preset.value)}
                className="py-2 px-4 rounded-[8px] border border-[#E5E7EB] bg-white text-[#111827] hover:bg-gray-50"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h2 className="text-base font-normal text-[#111827] mb-4">
            Payment Method
          </h2>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`w-full flex items-center justify-between p-4 rounded-[14px] border ${
                  selectedPaymentMethod === method.id
                    ? "border-[#0172E6] bg-[#F5F9FF]"
                    : "border-[#E5E7EB] bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={method.icon}
                    alt={method.label}
                    width={20}
                    height={18}
                  />
                  <span className="text-[#111827] font-normal text-base">
                    {method.label}
                  </span>
                </div>
                <Image
                  src="/icons/Path (3).svg"
                  alt="Select"
                  width={8}
                  height={14}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Add Funds Button */}
        <button className="w-full bg-[#0172E6] text-white rounded-[12px] py-3 px-4 flex items-center justify-center gap-2 mb-6">
          <Image src="/icons/Path (4).svg" alt="Add" width={20} height={20} />
          Add Funds
        </button>

        {/* Fee Information */}
        <div className="space-y-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] p-4">
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
              ${Number(amount).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <TransactionHistory />
    </div>
  );
};

export default AddFundsPage;
