"use client";
import { usePrivy } from "@privy-io/react-auth";
import WalletConnectedCard from "../WalletConnectedCard";
import LoginCard from "./LoginCard";

const GetStarted = () => {
  const { authenticated, ready } = usePrivy();
  // useEffect(() => {}, [ready, authenticated]);

  if (ready && authenticated) return <WalletConnectedCard />;
  return <LoginCard />;
  return;
};

export default GetStarted;
