import { ERC20_ABI } from "@/constants/abis";
import {
  MPT_CONTRACTS,
  USDC_CONTRACTS,
  USDT_CONTRACTS,
} from "@/constants/contracts/contract_addresses";
import { ethers } from "ethers";

import { MoonPay } from "@moonpay/moonpay-node";

export const fundWalletWithMoonPay = async ({
  walletAddress,
  email,
  reidrectUrl,
}: {
  walletAddress: string;
  email: string;
  reidrectUrl: string;
}) => {
  try {
    const sk_key = process.env.MOONPAY_SECRET_KEY;
    const pk_key = process.env.MOONPAY_PUBLISHABLE_KEY;
    const moonPay = new MoonPay(sk_key!);

    const params = {
      apiKey: pk_key!,
      walletAddress,
      reidrectUrl,
      email,
      baseCurrencyCode: "USD",
    };

    const signedUrl = moonPay.url.generate({ flow: "buy", params });

    if (!signedUrl)
      return {
        success: false,
        error: "Error funding wallet with MoonPay",
      };

    return {
      success: true,
      url: signedUrl,
    };
  } catch (error) {
    console.error("Error funding wallet with MoonPay:", error);
    return {
      success: false,
      error: "Error funding wallet with MoonPay",
    };
  }
};

export const fetchUserTokenBalance = async ({
  provider,
  userWallet,
  tokenAddress,
  decimals,
}: {
  provider: any;
  userWallet: string;
  tokenAddress: string;
  decimals?: number;
}) => {
  try {
    const usdcContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    // Fetch balance
    const balance = await usdcContract.balanceOf(userWallet);
    const formattedBalance = ethers.utils.formatUnits(balance, decimals ?? 18);

    return formattedBalance;
  } catch (error) {
    console.error("Error fetching user token balance:", error);
  }
};

export async function getETHBalance(userWallet: string, privyProvider: any) {
  const ethBal = await new ethers.providers.Web3Provider(
    privyProvider
  ).getBalance(userWallet);

  const formattedBalance = ethers.utils.formatEther(ethBal);
  return formattedBalance;
}
export async function getUSDTBalance(
  userWallet: string,
  chainId: number,
  privyProvider: any
) {
  // Connect to the blockchain
  const provider = new ethers.providers.Web3Provider(privyProvider);

  const formattedBalance = await fetchUserTokenBalance({
    provider: provider,
    tokenAddress: USDT_CONTRACTS[chainId],
    userWallet: userWallet,
    decimals: 6,
  }); // USDC has 18 decimal places

  return formattedBalance ?? "";
}
export async function getUSDCBalance(
  userWallet: string,
  chainId: number,
  privyProvider: any
) {
  // Connect to the blockchain
  const provider = new ethers.providers.Web3Provider(privyProvider);
  const formattedBalance = await fetchUserTokenBalance({
    provider: provider,
    tokenAddress: USDC_CONTRACTS[chainId],
    userWallet: userWallet,
  }); // USDC has 18 decimal places

  return formattedBalance ?? "";
}

export async function getMPTBalance(
  userWallet: string,
  chainId: number,
  privyProvider: any
) {
  // Connect to the blockchain
  const provider = new ethers.providers.Web3Provider(privyProvider);
  const formattedBalance = await fetchUserTokenBalance({
    provider: provider,
    tokenAddress: MPT_CONTRACTS[chainId],
    userWallet: userWallet,
  }); // USDC has 18 decimal places

  return formattedBalance ?? "";
}
