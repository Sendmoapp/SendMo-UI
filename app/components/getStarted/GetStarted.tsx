"use client";
import React from "react";
import WalletConnectedCard from "../WalletConnectedCard";
import { usePrivy } from "@privy-io/react-auth";

const GetStarted = () => {
  const { authenticated, ready } = usePrivy();
  if (ready && authenticated) return <WalletConnectedCard />;
};

export default GetStarted;
