"use client";
import { Button } from "@/components/ui/button";
import useAccount from "@/hooks/use-account";
import { useFundWallet, usePrivy } from "@privy-io/react-auth";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
const MoonPayBuyWidget = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
  { ssr: false }
);

const FinanceButton = () => {
  const { ready, user } = usePrivy();
  // const ref = React.useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const { fundWallet } = useFundWallet();
  const { currentChain } = useAccount();
  const handleTransactionCompleted = async (trx: any) => {
    console.log("Transaction completed:", trx);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 p-6 bg-white border border-[#E5E7EB] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08) rounded-[24px]">
        <Link
          href="/send_funds"
          className="flex flex-col items-center justify-center gap-3 bg-[#0172E6] text-white p-4 h-[92px] rounded-[16px]"
        >
          <Image src="/assets/Path@1x.png" alt="Send" width={20} height={20} />
          <span>Send</span>
        </Link>
        <Link
          href="/receive_funds"
          className="flex flex-col items-center justify-center gap-3 bg-transparent text-[#696c6e] text-base font-normal p-4 h-[92px] rounded-xl border border-[#E5E7EB]"
        >
          <Image
            src="/assets/receive.png"
            alt="Receive"
            width={20}
            height={20}
          />
          <span>Receive</span>
        </Link>
        <Button
          onClick={async () => {
            if (!user || !ready) return;
            fundWallet(user!.wallet!.address!);
          }}
          className="flex flex-col items-center justify-center gap-3 bg-[#F9FAFB] text-[#0172E6] text-base font-normal p-4 h-[92px] rounded-xl border border-[#E5E7EB] hover:bg-gray-100"
        >
          <Image
            src="/assets/add_icon.png"
            alt="Add Funds"
            width={20}
            height={20}
          />
          <span>Add Funds</span>
        </Button>
      </div>
      <MoonPayBuyWidget
        variant="overlay"
        baseCurrencyCode="usd"
        baseCurrencyAmount="100"
        defaultCurrencyCode="usdc"
        visible={visible}
        onBalanceDepositTransferConfirmed={() => console.log("deposit trx")}
        onTransactionCompleted={(trx) => handleTransactionCompleted(trx)}

        // onClose={async () => setVisible(false)}
      />
    </div>
  );
};

export default FinanceButton;
