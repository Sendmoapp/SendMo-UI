"use client";
import React from "react";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

const Page = () => {
  const { ready, authenticated } = usePrivy();
  return (
    <main className="bg-bg-element  min-h-screen bg-cover bg-repeat mx-auto">
      <Header />
      <section className="text-center px-10 pt-20 pb-16">
        <div className="w-full flex justify-center mb-8">
          <Image
            src="/assets/coins.png"
            alt="coins"
            width={207}
            height={60}
            className=""
          />
        </div>

        <h1 className="text-[72px] font-bold mb-6">
          Send Money Instantly{" "}
          <span className="bg-gradient-to-r from-[#0172E6] to-[#A855F7] text-transparent bg-clip-text">
            in <br /> Stablecoins
          </span>
        </h1>
        <p className="text-[#4B5563] text-[28px] font-medium max-w-[1152px] mx-auto mb-8">
          Experience the future of payments with instant Stablecoins (USDC,
          USDT, FDUSD and BUSD) transfers. No fees, no delays, just seamless
          transactions.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href={ready && authenticated ? "/dashboard" : "/auth"}
            className="px-[80px] py-5 bg-[#0172E6] text-white text-2xl font-semibold rounded-[16px] hover:bg-blue-600"
          >
            {ready && authenticated ? "Go to Dashboard" : "Get Started"}
          </Link>
          {/* <button className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800">
            Learn More
          </button> */}
        </div>
      </section>

      {/* Placeholder for the dashboard preview image */}
      <div className=" mx-auto px-10 pb-20 ">
        <div className="w-full h-[1159px] relative">
          <Image fill alt="" src="/assets/hero image@2x.png" />
        </div>
      </div>

      {/* Adding the footer */}
      <Footer />
    </main>
  );
};

export default Page;
