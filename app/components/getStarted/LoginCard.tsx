"use client";

import { useToast } from "@/hooks/use-toast";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginCard = () => {
  const { toast } = useToast();
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

  const { login } = useLogin({
    onComplete: (userProp) => {
      if (userProp.isNewUser) {
        router.push("/auth/get-started");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (e) => {
      console.log(e);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e.toString(),
      });
    },
  });

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated]);

  return (
    <div className="w-full max-w-[600px] rounded-[40px] bg-white p-10 shadow-lg backdrop-blur-xl flex flex-col items-center z-10 mb-[100px]">
      <Image src="/assets/IMG.svg" alt="Wallet" height={80} width={80} />
      <p className="text-[40px] font-extrabold text-center mb-2">
        Welcome to{" "}
        <span className="bg-gradient-to-r from-[#0172E6] to-[#A855F7] text-transparent bg-clip-text">
          Payment
        </span>{" "}
        with{" "}
        <span className="bg-gradient-to-r from-[#0172E6] to-[#A855F7] text-transparent bg-clip-text">
          Stablecoins
        </span>
      </p>
      <p className="text-[18px] font-normal text-[#4B5563] mb-10">
        Choose how you want to get started
      </p>
      <button
        onClick={() => login({})}
        className="w-full flex items-center justify-center py-2 text-white bg-[#0172E6] border rounded-[8px] hover:text-grey-200 gap-2 text-sm font-medium mb-4"
      >
        <Image
          src="/icons/wallet-white.svg"
          alt="wallet"
          width={14}
          height={12}
        />
        Click to get started
      </button>
      {/* <button
        onClick={() =>
          login({
            disableSignup: true,
          })
        }
        className="w-full flex items-center justify-center py-2 text-white bg-black border rounded-[8px] hover:text-grey-300 gap-2 text-sm font-medium mb-10"
      >
        <Image src="/icons/email.svg" alt="wallet" width={14} height={12} />
        Click here to login
      </button> */}
      <p className="text-xs font-normal text-[#6B7280]">
        By continuing, you agree to our{" "}
        <Link href="/" className="text-[#0172E6]">
          Privacy Policy
        </Link>{" "}
        and
        <Link href="/" className="text-[#0172E6]">
          {" "}
          Terms of Service
        </Link>{" "}
      </p>
    </div>
  );
};

export default LoginCard;
