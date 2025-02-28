import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AuthGuard from "../components/hoc/AuthGuard";
import { Toaster } from "@/components/ui/toaster";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen lg:px-[50px]  xl:px-[208px] flex-col justify-between items-center bg-[#F9FAFB]">
        <AuthGuard>{children}</AuthGuard>
        <Toaster />
      </main>
      <Footer />
    </>
  );
};

export default layout;
