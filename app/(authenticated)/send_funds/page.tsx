"use client";
import BackButton from "@/app/components/BackButton";
import TransactionHistory from "@/app/components/TransactionHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ERC20_ABI } from "@/constants/abis";
import {
  MPT_CONTRACTS,
  USDC_CONTRACTS,
  USDT_CONTRACTS,
} from "@/constants/contracts/contract_addresses";
import { useToast } from "@/hooks/use-toast";
import { fetchUserTokenBalance } from "@/lib/helpers";
import { extractChainId, isValidWalletAddress } from "@/lib/utils";
import {
  SendTransactionModalUIOptions,
  UnsignedTransactionRequest,
  useSendTransaction,
} from "@privy-io/react-auth";
import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { encodeFunctionData } from "viem";
// import { RPC_URLS } from "@/constants/rpcUrls";
import { userAccountAtom } from "@/app/state/atoms";
import useAccount from "@/hooks/use-account";
import { useAtom } from "jotai";
import { useDebounce } from "use-debounce";
import { getUsers } from "@/app/server_actions/userActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const SendFunds = () => {
  const { sendTransaction } = useSendTransaction();
  const [selectedCurrency, setSelectedCurrency] = useState("mpt");
  const [amount, setAmount] = useState("");
  const [recipient, setrecipient] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { embeddedWallet, currentChain } = useAccount();
  const [userBalaces, _] = useAtom(userAccountAtom);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [debouncedSearchQuery] = useDebounce(recipient, 500);
  const [isfetching, setIsFetching] = useState(false);

  async function sendStablecoin() {
    setLoading(true);

    try {
      if (!embeddedWallet) throw new Error("No embedded wallet found");
      if (!selectedUser && !isValidWalletAddress(debouncedSearchQuery)) {
        throw new Error("Invalid recipient address");
      }
      const provider = await embeddedWallet.getEthereumProvider();
      const chainId = extractChainId(embeddedWallet.chainId);
      const ethBal = await new ethers.providers.Web3Provider(
        provider
      ).getBalance(embeddedWallet.address);

      if (ethBal < ethers.utils.parseEther("0.001")) {
        throw new Error("Not enough ETH for gas fees!");
      }
      if (selectedCurrency === "eth") {
        const amountIn = ethers.utils.parseEther(amount.toString());
        const unsignedTx: UnsignedTransactionRequest = {
          to: selectedUser?.walletAddress || debouncedSearchQuery,
          chainId: Number(chainId),
          value: BigInt(amountIn.toString()),
          gasLimit: "60000",
        };

        const uiConfig: SendTransactionModalUIOptions = {
          description: "SendMo is requesting your approval to send funds",
          buttonText: "Approve",
          isCancellable: true,
        };

        await sendTransaction(unsignedTx, {
          uiOptions: uiConfig,
        });
        return;
      }
      let tokenAddress;

      if (selectedCurrency === "usdt") {
        tokenAddress = USDT_CONTRACTS[Number(chainId)];
      } else if (selectedCurrency === "usdc") {
        tokenAddress = USDC_CONTRACTS[Number(chainId)];
      } else if (selectedCurrency === "mpt") {
        tokenAddress = MPT_CONTRACTS[Number(chainId)];
      }
      if (!tokenAddress) throw new Error("No token address found");

      const amountIn = ethers.utils.parseUnits(
        amount.toString(),
        selectedCurrency === "mpt" ? 18 : 6
      );

      const tokenBalance = await fetchUserTokenBalance({
        provider: new ethers.providers.JsonRpcProvider(
          currentChain.rpcUrls.default.http[0]
        ),
        tokenAddress,
        userWallet: embeddedWallet.address,
        decimals: selectedCurrency === "mpt" ? 18 : 6,
      });

      if (tokenBalance && Number(tokenBalance) < Number(amount)) {
        throw new Error("Not enough token balance");
      }

      const to = selectedUser?.walletAddress || debouncedSearchQuery;
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [to, amountIn],
      });
      const unsignedTx: UnsignedTransactionRequest = {
        to: tokenAddress,
        chainId: Number(chainId),
        data,
        gasLimit: "60000",
      };

      const uiConfig: SendTransactionModalUIOptions = {
        description: "SendMo is requesting your approval to send funds",
        buttonText: "Approve",
        isCancellable: true,
      };

      await sendTransaction(unsignedTx, {
        uiOptions: uiConfig,
      });
    } catch (error: any) {
      console.error("Transaction failed:", error);
      toast({
        variant: "destructive",
        title: "Error Sending Funds",
        description: error?.message || "Failed to send funds",
      });
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
      setSelectedUser(null);
      setAmount("");
      setrecipient("");
      setSearchResults([]);
    }
  }

  const returnTokenImageData = () => {
    switch (selectedCurrency) {
      case "eth":
        return {
          src: "/assets/eth.svg",
          alt: "ETH",
        };
      case "usdt":
        return {
          src: "/assets/usdt.png",
          alt: "USDT",
        };
      case "usdc":
        return {
          src: "/assets/usdc.png",
          alt: "USDC",
        };
      case "mpt":
        return {
          src: "/assets/moonpay.png",
          alt: "MPT",
        };
      default:
        return {
          src: "",
          alt: "",
        };
    }
  };
  const returnBalance = () => {
    switch (selectedCurrency) {
      case "usdt":
        return (userBalaces?.usdtBalance ?? 0).toFixed(2) + " USDT";
      case "usdc":
        return (userBalaces?.usdcBalance ?? 0).toFixed(2) + " USDC";
      case "mpt":
        return (userBalaces?.mptBalance ?? 0).toFixed(2) + " MPT";
      default:
        return (userBalaces?.ethBalance ?? 0).toFixed(2) + " ETH";
    }
  };

  const fetchUsers = async (query: string) => {
    if (!query) return;
    setIsFetching(true);
    try {
      const response = await getUsers(query);
      if (response.success) {
        setSearchResults(response.results || []);
        setIsDialogOpen(true);
      } else {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsFetching(false);
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setrecipient(e.target.value);
  };

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchUsers(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(false);
    // setrecipient(user.username || user.email || user.walletAddress);
  };
  return (
    <div className="w-full mx-auto">
      {/* Back Button */}
      <BackButton />
      {/* Main Content */}
      <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)">
        <h1 className="text-2xl font-semibold text-[#111827] mb-6">
          Send Money
        </h1>
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={recipient}
              disabled={isfetching}
              onChange={handleSearchChange}
              // onBlur={() => fetchUsers(debouncedSearchQuery)}
              placeholder="Search by wallet address, email, or username"
              className="w-full rounded-[14px] border border-[#D4D4D8] p-4 bg-[#F9FAFB]"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Image
                src="/icons/search.svg"
                alt="Search"
                width={18}
                height={18}
              />
            </button>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Recipient</DialogTitle>
            </DialogHeader>

            <div className="space-y-2">
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <Button
                    key={user.userId}
                    variant="outline"
                    className="w-full flex justify-between"
                    onClick={() => handleSelectUser(user)}
                  >
                    <span>{user.username || user.email}</span>
                    <span className="text-muted-foreground">
                      {user.walletAddress}
                    </span>
                  </Button>
                ))
              ) : (
                <p className="text-muted-foreground text-center">
                  No user found. Proceeding with entered address.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
        {selectedUser && (
          <div className="my-4 p-3 border rounded-lg bg-gray-100">
            <p>
              <strong>Selected User:</strong>{" "}
              {selectedUser.username || selectedUser.email}
            </p>
            <p>
              <strong>Wallet Address:</strong> {selectedUser.walletAddress}
            </p>
          </div>
        )}

        <div className="bg-[#F9FAFB]  p-4 ] rounded-[24px] border border-[#E5E7EB]">
          <div className="flex justify-between items-center">
            <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">
              Amount to Send
            </p>
            <p className="text-base font-normal text-[#9CA3AF] mb-[10px]">
              Balance: {returnBalance()}
            </p>
          </div>
          <div className="flex items-center justify-between border rounded-xl p-4">
            <Select defaultValue="mpt" onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-[115px] h-[48px] border-none bg-white p-2 rounded-[8px]">
                <SelectValue asChild>
                  <div className="flex items-center gap-2">
                    <Image
                      src={returnTokenImageData().src}
                      alt={returnTokenImageData().alt}
                      width={32}
                      height={32}
                    />
                    <span>{selectedCurrency?.toUpperCase()}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eth">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/eth.svg"
                      alt="ETH"
                      width={24}
                      height={24}
                    />
                    <span>ETH</span>
                  </div>
                </SelectItem>
                <SelectItem value="mpt">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/moonpay.png"
                      alt="MPT"
                      width={24}
                      height={24}
                    />
                    <span>MPT</span>
                  </div>
                </SelectItem>
                <SelectItem value="usdc">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/usdc.png"
                      alt="USDC"
                      width={24}
                      height={24}
                    />
                    <span>USDC</span>
                  </div>
                </SelectItem>
                <SelectItem value="usdt">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/usdt.png"
                      alt="USDT"
                      width={24}
                      height={24}
                    />
                    <span>USDT</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-right text-2xl font-bold text-[#6B7280] w-1/2 focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          {/* <p className="text-base font-normal text-[#9CA3AF] mt-[10px]">
            ≈ 0.00 USD
          </p> */}
        </div>
        <button
          disabled={loading}
          onClick={sendStablecoin}
          className="w-full bg-[#0172E6] text-white rounded-xl py-3 my-4"
        >
          {loading ? "Confirming Payment..." : "Confirm Payment"}
        </button>
        {/* Fee Information */}
        {/* <div className="space-y-4  bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] p-4">
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280] font-normal text-base">
              Network Fee
            </span>
            <span className="text-[#111827] text-base font-semibold">
              $0.00
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280] font-normal text-base">
              Total Amount
            </span>
            <span className="text-[#111827] text-base font-semibold">
              $0.00
            </span>
          </div>
        </div> */}
      </div>

      <TransactionHistory />
    </div>
  );
};

export default SendFunds;
