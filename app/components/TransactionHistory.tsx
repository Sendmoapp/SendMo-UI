"use client";
import useAccount from "@/hooks/use-account";
import { useToast } from "@/hooks/use-toast";
import { formatAddress, formatDate } from "@/lib/utils";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserTransactions } from "../server_actions/accountActions";
import { transactionsAtom } from "../state/atoms";

const TransactionHistory = () => {
  const [histories, sethistories] = useAtom(transactionsAtom);
  const { currentChain, embeddedWallet } = useAccount();
  const [historyLoading, setHistoryLoading] = useState(false);
  const { toast } = useToast();
  const getHistories = async () => {
    if (!embeddedWallet) throw new Error("No embedded wallet found");
    try {
      setHistoryLoading(true);
      const res = await getUserTransactions(embeddedWallet?.address!);

      //@ts-ignore
      sethistories(res);
    } catch (error) {
      console.error("Error fetching user wallet balance:", error);
      toast({
        title: "Error fetching history",
        variant: "destructive",
        description: "Please try again",
      });
    } finally {
      setHistoryLoading(false);
    }
  };
  useEffect(() => {
    if (!currentChain || !embeddedWallet) return;
    getHistories();
  }, [currentChain, embeddedWallet]);
  if (historyLoading)
    return (
      <div className="py-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#111827]">
            Recent Transactions
          </h3>
          <Link href="/transactions" className="text-blue-500">
            See all
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#F9FAFB] p-4 border border-[#E5E7EB] rounded-[16px]">
            <div className="flex items-center gap-3">
              <div className="animate-pulse h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex flex-col"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-[#111827]">
          Recent Transactions
        </h3>
        <Link href="/transactions" className="text-blue-500">
          See all
        </Link>
      </div>

      <div className="space-y-4">
        {histories.map((history, index) => {
          const recieved = history.type === "RECEIVED";
          const isCardFunding = history.type === "FUNDING";
          return (
            <Link
              href={`/transactions/${history.hash}`}
              key={index}
              className="flex items-center justify-between bg-[#F9FAFB] p-4 border border-[#E5E7EB] rounded-[16px]"
            >
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/user_avata.png"
                  alt="user_avatar"
                  width={40}
                  height={40}
                />
                <div>
                  {!isCardFunding && (
                    <p className="font-medium text-base">
                      {!recieved
                        ? "Sent to " + formatAddress(history.to)
                        : "Received from " + formatAddress(history.from)}
                    </p>
                  )}

                  {isCardFunding && (
                    <p className="font-medium text-base">
                      Added funds via credit card
                    </p>
                  )}
                  <p className="text-sm text-[#9CA3AF] font-normal">
                    {formatDate(history.timestamp)}
                  </p>
                </div>
              </div>
              <p
                className={`${
                  recieved || isCardFunding
                    ? "text-[#10B981]"
                    : "text-[#EF4444]"
                } font-normal text-sm`}
              >
                {`${recieved || isCardFunding ? "+" : "-"} ${parseFloat(
                  history.value
                ).toString()} ${history.tokenSymbol}`}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionHistory;
