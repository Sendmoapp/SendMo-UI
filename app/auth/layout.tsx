import Image from "next/image";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="bg-bg-element-onboarding min-h-screen bg-cover bg-repeat mx-auto flex items-center flex-col justify-between pt-[100px]">
      {children}
      <div className="w-full bg-white flex items-center justify-between py-6 px-10">
        <Image
          src="/assets/logo.png"
          alt="MetaBridge Logo"
          width={150}
          height={32}
          className="cursor-pointer"
        />
        <p className="text-[#3D3D3D] font-normal text-[18px]">
          Copyright MetaBridge Inc, 2025, All Right Reserved.
        </p>
        <div className="flex items-center gap-3">
          <Image alt="X" src="/icons/X-black.svg" height={14} width={18} />
          <Image
            alt="Discord"
            src="/icons/telegram-black.svg"
            height={14}
            width={18}
          />
          <Image
            alt="telegram"
            src="/icons/telegram-black.svg"
            height={14}
            width={18}
          />
        </div>
      </div>
    </main>
  );
};

export default layout;
