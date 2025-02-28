"use client";
import {
  approveToken,
  executeSwap,
  quoteAndLogSwap,
} from "@/app/server_actions/swap_with_uniswap";
import { userAccountAtom } from "@/app/state/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WETH_ABI } from "@/constants/abis/weth";
import useAccount from "@/hooks/use-account";
import { useToast } from "@/hooks/use-toast";
import { tokenList } from "@/lib/tokenList";
import { ethers } from "ethers";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

const ConversionButton = () => {
  const [fromAmount, setfromAmount] = useState("");
  const [toAmount, settoAmount] = useState("");
  const [quotedAmountOut, setquotedAmountOut] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(
    tokenList[0]!.ticker
  );
  const [selectedCurrencyTo, setSelectedCurrencyTo] = useState(
    tokenList[1]!.ticker
  );
  const [loading, setLoading] = useState(false);
  const [swaploading, setswapLoading] = useState(false);
  const [userBalaces, _] = useAtom(userAccountAtom);
  const { toast } = useToast();
  const { embeddedWallet } = useAccount();
  const [prices, setPrices] = useState<{
    tokenOne: number;
    tokenTwo: number;
    ratio: number;
  } | null>(null);

  const returnBalance = () => {
    if (selectedCurrency.toLocaleLowerCase() === "usdt") {
      return (userBalaces?.usdtBalance ?? 0).toFixed(2) + " USDT";
    } else if (selectedCurrency.toLocaleLowerCase() === "usdc") {
      return (userBalaces?.usdcBalance ?? 0).toFixed(2) + " USDC";
    } else {
      return (userBalaces?.ethBalance ?? 0).toFixed(2) + " ETH";
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setfromAmount(e.target.value);
    // if (e.target.value && prices) {
    //   settoAmount((Number(e.target.value) * prices.ratio).toFixed(2));
    // } else {
    //   settoAmount("");
    // }
  };

  const handleSwap = async () => {
    if (!embeddedWallet) {
      toast({
        title: "No wallet found",
        variant: "destructive",
        description: "Please connect your wallet",
      });
      return;
    }
    if (!fromAmount || !selectedCurrency || !selectedCurrencyTo) {
      toast({
        title: "A required field is missing",
        variant: "destructive",
        description: "Please fill all fields",
      });
      return;
    }
    try {
      setswapLoading(true);
      const provider = await embeddedWallet!.getEthereumProvider();
      const signer = new ethers.providers.Web3Provider(provider).getSigner();
      await approveToken({
        tokenAddress: tokenList.find(
          (token) => token!.ticker === selectedCurrency
        )!.address,
        amount: fromAmount,
        wallet: signer,
        tokenABI: WETH_ABI,
      });

      const res = await executeSwap({
        amountIn: ethers.utils.parseEther(fromAmount),
        quotedAmountOut: ethers.utils.parseUnits(quotedAmountOut, 6),
        signer: signer,
      });
      if (res) {
        toast({
          title: "Swap successful",
          variant: "default",
          description: "Swap successful",
        });
        setfromAmount("");
        settoAmount("");
        setquotedAmountOut("");
      } else {
        setfromAmount("");
        settoAmount("");
        setquotedAmountOut("");
        toast({
          title: "Swap failed",
          variant: "destructive",
          description: "failed to complete the swap",
        });
      }
    } catch (error) {
      console.error("Error swapping:", error);
      toast({
        title: "Error swapping",
        variant: "destructive",
        description: "Please try again",
      });
    } finally {
      setswapLoading(false);
    }
  };

  const fetchQuote = async () => {
    if (!fromAmount) {
      toast({
        title: "Please enter an amount",
        variant: "destructive",
        description: "Please enter an amount",
      });
      return;
    }
    setLoading(true);
    try {
      const provider = await embeddedWallet!.getEthereumProvider();
      const signer = new ethers.providers.Web3Provider(provider).getSigner();

      const res = await quoteAndLogSwap({
        fee: 3000,
        signer: signer,
        amountIn: fromAmount,
      });
      if (res) {
        setquotedAmountOut(res);
        settoAmount(res);
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Error fetching quote",
        variant: "destructive",
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log({ quotedAmountOut, toAmount });
  // useEffect(() => {
  //   // fetchTokenPrice();
  //   if (!embeddedWallet) return;
  //   // fetchQuote();
  // }, [embeddedWallet, selectedCurrency, selectedCurrencyTo]);

  return (
    <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)">
      <h3 className="text-2xl font-semibold mb-4">Convert Asset</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#F9FAFB]  p-4 ] rounded-[24px] border border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">
              From
            </p>
            <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">
              Balance: {returnBalance()}
            </p>
          </div>
          <div className="flex items-center justify-between border rounded-xl p-4">
            <Select
              defaultValue={selectedCurrency}
              onValueChange={(e) => setSelectedCurrency(e)}
            >
              <SelectTrigger className="w-[115px] h-[48px] border-none bg-white p-2 rounded-[8px]">
                <SelectValue asChild>
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        tokenList.find(
                          (token) => token!.ticker === selectedCurrency
                        )?.img ?? ""
                      }
                      alt={
                        tokenList.find(
                          (token) => token!.ticker === selectedCurrency
                        )?.ticker ?? ""
                      }
                      width={32}
                      height={32}
                    />
                    <span>{selectedCurrency?.toUpperCase()}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tokenList.map((token) => (
                  <SelectItem key={token!.ticker} value={token!.ticker}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={token!.img}
                        alt={token!.ticker}
                        width={24}
                        height={24}
                      />
                      <span>{token!.ticker}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="number"
              value={fromAmount}
              onChange={handleAmountChange}
              disabled={loading}
              placeholder="0.00"
              className="text-right text-2xl font-bold text-[#6B7280] w-1/2 focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        <div className="bg-[#F9FAFB]  p-4 ] rounded-[24px] border border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">To</p>
            {/* <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">
              1 USDC = $1.00
            </p> */}
          </div>

          <div className="flex items-center justify-between border rounded-xl p-4">
            <Select
              defaultValue={selectedCurrencyTo}
              onValueChange={(e) => setSelectedCurrencyTo(e)}
            >
              <SelectTrigger className="w-[115px] h-[48px] border-none bg-white p-2 rounded-[8px]">
                <SelectValue asChild>
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        tokenList.find(
                          (token) => token!.ticker === selectedCurrencyTo
                        )?.img ?? ""
                      }
                      alt={
                        tokenList.find(
                          (token) => token!.ticker === selectedCurrencyTo
                        )?.ticker ?? ""
                      }
                      width={32}
                      height={32}
                    />
                    <span>{selectedCurrencyTo?.toUpperCase()}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tokenList.map((token) => (
                  <SelectItem key={token!.ticker} value={token!.ticker}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={token!.img}
                        alt={token!.ticker}
                        width={24}
                        height={24}
                      />
                      <span>{token!.ticker}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="number"
              value={toAmount}
              disabled={true}
              placeholder="0.00"
              className="text-right text-2xl font-bold text-[#6B7280] w-1/2 focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>
      {quotedAmountOut && (
        <p className="text-base font-normal text-[#9CA3AF] my-[10px]">
          You will receive {quotedAmountOut} {selectedCurrencyTo} for{" "}
          {fromAmount} {selectedCurrency}
        </p>
      )}
      <div className="flex justify-between items-center gap-5">
        <button
          onClick={fetchQuote}
          disabled={loading}
          className="w-full bg-[#0172E6] text-white rounded-xl py-3 mt-4"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          ) : quotedAmountOut ? (
            "Re Quote"
          ) : (
            "Get Quote"
          )}
        </button>
        {quotedAmountOut && (
          <button
            onClick={handleSwap}
            disabled={swaploading}
            className="w-full bg-[#0172E6] text-white rounded-xl py-3 mt-4"
          >
            {swaploading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            ) : (
              "Swap Now"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ConversionButton;
