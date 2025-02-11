import Image from "next/image";
import Link from "next/link";
import React from "react";

const BackButton = () => {
  return (
    <div className="py-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-[#111827] font-normal text-base bg-white py-2 px-[6px] w-[131px] rounded-[8px] border border-[#E5E7EB]"
      >
        <Image src="/icons/arrow_left.svg" alt="Back" width={8} height={13} />
        Back Home
      </Link>
    </div>
  );
};

export default BackButton;
