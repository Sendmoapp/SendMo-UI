"use client";

import BackButton from "@/app/components/BackButton";
import { transactionsAtom } from "@/app/state/atoms";
import useAccount from "@/hooks/use-account";
import { formatAddress, formatDate } from "@/lib/utils";
import { useAtom } from "jotai";
import { Check, Copy, Download } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TransactionReceipt() {
  const [copyFromClicked, setCopyFromClicked] = useState(false);
  const [copyHashClicked, setCopyHashClicked] = useState(false);
  const [histories] = useAtom(transactionsAtom);
  const { embeddedWallet } = useAccount();
  const [trx, settrx] = useState<{
    hash: string;
    from: string;
    to: string;
    value: any;
    token: string;
    timestamp: string;
    tokenName: any;
    tokenSymbol: any;
    tokenDecimal: any;
    type: string;
    blockNumber: string;
  }>({
    hash: "",
    from: "",
    to: "",
    value: "",
    token: "",
    timestamp: "",
    tokenName: "",
    tokenSymbol: "",
    tokenDecimal: "",
    type: "",
    blockNumber: "",
  });
  const params = useParams();
  const trxid = params.details;

  useEffect(() => {
    const trx = histories.find((history) => history.hash === trxid);
    settrx(
      trx ?? {
        hash: "",
        from: "",
        to: "",
        value: "",
        token: "",
        timestamp: "",
        tokenName: "",
        tokenSymbol: "",
        tokenDecimal: "",
        type: "",
        blockNumber: "",
      }
    );
  }, [trxid, histories]);

  const handleCopyFrom = () => {
    navigator.clipboard.writeText("0x1234...5678");
    setCopyFromClicked(true);
    setTimeout(() => setCopyFromClicked(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText("0xabcd...efgh");
    setCopyHashClicked(true);
    setTimeout(() => setCopyHashClicked(false), 2000);
  };

  return (
    <div className="w-full mx-auto">
      <BackButton />
      <div className="flex justify-center items-center mb-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Transaction Details
          </h2>
          {trx.hash && (
            <>
              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-green-500">Completed</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">
                    {parseFloat(trx?.value).toString()} ${trx?.tokenSymbol}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">From</span>
                  <div className="flex items-center bg-gray-100 rounded-full py-1 px-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 mr-2"></div>
                    <span className="text-sm mr-1">
                      {formatAddress(trx?.from ?? "")}
                    </span>
                    <button
                      onClick={handleCopyFrom}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copyFromClicked ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">To</span>
                  <div className="flex items-center">
                    <span>
                      {embeddedWallet?.address.toLocaleLowerCase() === trx?.to
                        ? "You"
                        : formatAddress(trx?.to ?? "")}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Network Fee</span>
                  <span>0.001 USDC</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Date</span>
                  <div className="flex items-center">
                    <span> {formatDate(trx?.timestamp ?? "")}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction Hash</span>
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-1">
                      {trx?.hash.slice(0, 10) + "..." + trx?.hash.slice(-10)}
                    </span>
                    <button
                      onClick={handleCopyHash}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copyHashClicked ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Transaction Receipt
                </h3>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Block</span>
                  <span>{trx?.blockNumber}</span>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Block Confirmations</span>
                  <span>24</span>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">Gas Used</span>
                  <span>21,000</span>
                </div>

                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center">
                  <Download size={18} className="mr-2" />
                  Download Receipt
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
