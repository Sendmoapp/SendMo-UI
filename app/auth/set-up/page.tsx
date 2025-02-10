import AccountSetupForm from "@/app/components/AccountSetupForm";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="w-full max-w-[600px] rounded-[40px] bg-white p-10 shadow-lg backdrop-blur-xl flex flex-col items-center z-10 mb-[100px]">
      <Image src="/assets/IMG.svg" alt="Wallet" height={80} width={80} />
      <p className="text-[40px] font-extrabold text-center mb-2">
        Account Setup
      </p>
      <p className="text-[18px] font-normal text-[#4B5563] mb-10">
        Complete your account setup to continue
      </p>
      <AccountSetupForm />
    </div>
  );
};

export default page;
