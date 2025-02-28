"use client";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import NetworkSelector from "./NetworkSelector";

const Header = () => {
  const { authenticated, ready, user } = usePrivy();

  return (
    <header className="py-4 px-6 bg-white border-b border-[#E5E7EB]">
      <nav className="flex justify-between items-center max-w-[1440px] mx-auto">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="MetaBridge Logo"
              width={150}
              height={40}
              className="cursor-pointer"
            />
          </Link>
        </div>
        {ready && authenticated ? (
          <div className="flex items-center gap-4">
            <NetworkSelector />

            <div className="flex items-center gap-2 bg-[#E5E7EB] py-1 px-2 rounded-[18px] ">
              <div className="h-6 w-6 overflow-hidden rounded-full">
                <img
                  src="/assets/wallet icon.svg"
                  alt="Wallet Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#111827]">
                  {user?.wallet?.address?.slice(0, 6)}****
                  {user?.wallet?.address?.slice(-4)}
                </span>
              </div>
              <Image
                alt="arrow-down"
                height={16}
                width={16}
                src="/icons/arrow-down-s-fill.svg"
              />
            </div>
            <Link
              href="/profile"
              className="flex items-center gap-2 bg-[#E5E7EB] py-1 px-2 rounded-[18px] "
            >
              <div className="h-6 w-6 overflow-hidden rounded-full">
                <img
                  src="/assets/user_avata.png"
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="text-sm font-medium text-[#111827]">layi</span>
            </Link>
          </div>
        ) : (
          ready &&
          !authenticated && (
            <div className="flex gap-4">
              <button className="flex px-4 py-2 text-[#0172E6] bg-[#F3F4F6] border rounded-[8px] hover:text-blue-600 items-center gap-2 text-sm font-medium">
                <Image
                  src="/icons/wallet.svg"
                  alt="wallet"
                  width={14}
                  height={12}
                />
                Connect Wallet
              </button>
              <button className="flex gap-2 items-center px-4 py-2 bg-[#0172E6] text-white rounded-md hover:bg-blue-600 text-sm font-medium">
                <Image
                  src="/icons/email.svg"
                  alt="wallet"
                  width={14}
                  height={10}
                />
                Email Login
              </button>
            </div>
          )
        )}
      </nav>
    </header>
  );
};

export default Header;
