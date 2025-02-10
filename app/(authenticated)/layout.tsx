import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AuthGuard from "../components/hoc/AuthGuard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen flex-col justify-between bg-[#F9FAFB]">
      <Header />
      <AuthGuard>{children}</AuthGuard>
      <Footer />
    </main>
  );
};

export default layout;
