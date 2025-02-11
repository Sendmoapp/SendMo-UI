import Image from "next/image";
import Link from "next/link";
import React from "react";

const TransactionHistory = () => {
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-[#111827]">
          Recent Transactions
        </h3>
        <Link href="/transactions" className="text-blue-500">
          See all
        </Link>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-[#F9FAFB] p-4 border border-[#E5E7EB] rounded-[16px]">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/user_avata.png"
              alt="user_avatar"
              width={40}
              height={40}
            />
            <div>
              <p className="font-medium text-base">Sent to Alex</p>
              <p className="text-sm text-[#9CA3AF] font-normal">2 hours ago</p>
            </div>
          </div>
          <p className="text-[#F87171] font-normal text-sm">-50.00 USDC</p>
        </div>
        <div className="flex items-center justify-between bg-[#F9FAFB] p-4 border border-[#E5E7EB] rounded-[16px]">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/profile.png"
              alt="user_avatar"
              width={40}
              height={40}
            />
            {/* <div className="w-10 h-10 bg-gray-100 rounded-full" /> */}
            <div>
              <p className="font-medium text-base">Received from Sarah</p>
              <p className="text-sm text-[#9CA3AF] font-normal">Yesterday</p>
            </div>
          </div>
          <p className="text-[#4ADE80] font-normal text-sm">+100.00 USDT</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
