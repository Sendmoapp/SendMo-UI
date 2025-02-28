"use server";
import { ethers } from "ethers";
import Moralis from "moralis";
import { cache } from "react";

const moralis = process.env.MORALIS_API_KEY;

if (!moralis) throw new Error("MORALIS API KEY  IS/ARE NOT AVAILABLE");

Moralis.start({
  apiKey: moralis,
})
  .then(() => {
    console.log("Moralis initialized");
  })
  .catch((error) => {
    console.error("Error initializing Moralis:", error);
  });
const returnTransactionType = (
  from: string,
  to: string,
  userWalletAddress: string
) => {
  const moonPayFundingAddres = "0xc216ed2d6c295579718dbd4a797845cda70b3c36";
  if (from === moonPayFundingAddres) return "FUNDING";
  if (from === userWalletAddress) return "SENT";
  if (to === userWalletAddress) return "RECEIVED";
};
export async function getUserTransactions(walletAddress: string) {
  try {
    const [tokenBal, nativeBal] = await Promise.all([
      Moralis.EvmApi.token.getWalletTokenTransfers({
        chain: "0xaa36a7",
        order: "DESC",
        address: walletAddress,
      }),
      await Moralis.EvmApi.transaction.getWalletTransactions({
        chain: "0xaa36a7",
        order: "DESC",
        address: walletAddress,
      }),
    ]);

    const tokenHistory = tokenBal.toJSON();
    const nativeHistory = nativeBal.toJSON();
    const nativeReceived = nativeHistory.result.filter(
      (t) =>
        t.to_address === walletAddress.toLocaleLowerCase() &&
        Number(t.value) > 0
    );
    const nativeSent = nativeHistory.result.filter(
      (t) =>
        t.from_address === walletAddress.toLocaleLowerCase() &&
        Number(t.value) > 0
    );

    const tokenReceived = tokenHistory.result.filter(
      (t) => t.to_address === walletAddress.toLocaleLowerCase()
    );
    const tokenSent = tokenHistory.result.filter(
      (t) => t.from_address === walletAddress.toLocaleLowerCase()
    );

    const formattedNativeTrx = nativeReceived.concat(nativeSent).map((trx) => {
      return {
        hash: trx.hash,
        from: trx.from_address,
        to: trx.to_address,
        value: ethers.utils.formatEther(trx.value),
        token: "",
        timestamp: trx.block_timestamp,

        tokenName: "Ethereum",
        blockNumber: trx.block_number,

        tokenSymbol: "ETH",

        tokenDecimal: "18",
        type: returnTransactionType(
          trx.from_address,
          trx.to_address,
          walletAddress
        ),
      };
    });

    const formattedTokenTrx = tokenReceived.concat(tokenSent).map((trx) => {
      return {
        hash: trx.transaction_hash,
        from: trx.from_address,
        to: trx.to_address,
        value: trx.value_decimal as string,
        token: trx.address,
        timestamp: trx.block_timestamp,

        tokenName: trx.token_name,
        blockNumber: trx.block_number,

        tokenSymbol: trx.token_symbol,

        tokenDecimal: trx.token_decimals,
        type: returnTransactionType(
          trx.from_address,
          trx.to_address,
          walletAddress
        ),
      };
    });

    const formattedTrx = formattedNativeTrx
      .concat(formattedTokenTrx)
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));

    return formattedTrx;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

const getTokenPrice = cache(async (tokenSymbol: string[]) => {
  const ids = tokenSymbol.join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
  const response = await fetch(url);
  const data = await response.json();

  return {
    usdtPrice: data?.tether?.usd || 0,
    usdcPrice: data["usd-coin"]?.usd || 0,
    ethPrice: data?.ethereum?.usd || 0,
  };
});
export const getUserBalance = async (
  walletAddress: string,
  chainId: string
) => {
  try {
    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: chainId,
      address: walletAddress,
    });
    const tokenHistory = JSON.parse(JSON.stringify(response.result));

    const { usdtPrice, usdcPrice, ethPrice } = await getTokenPrice([
      "tether",
      "usd-coin",
      "ethereum",
    ]);

    const usdtBalance =
      tokenHistory.find((t: any) => t.symbol === "USDT")?.balance_formatted ??
      "0";
    const usdcBalance =
      tokenHistory.find((t: any) => t.symbol === "USDC")?.balance_formatted ??
      "0";
    const ethBalance =
      tokenHistory.find((t: any) => t.symbol === "ETH")?.balance_formatted ??
      "0";
    const mptBalance =
      tokenHistory.find((t: any) => t.symbol === "MPT")?.balance_formatted ??
      "0";
    console.log({
      usdtPrice,
      usdcPrice,
      ethPrice,
      usdtBalance,
      usdcBalance,
      ethBalance,
      mptBalance,
    });
    const totalBalance =
      parseFloat(usdtBalance) * usdtPrice +
      parseFloat(usdcBalance) * usdcPrice +
      parseFloat(mptBalance) * 1 +
      parseFloat(ethBalance) * ethPrice;

    return {
      success: true,
      usdtBalance,
      usdcBalance,
      mptBalance: parseFloat(mptBalance).toFixed(2),
      ethBalance,
      ethInUsd: parseFloat(ethBalance) * ethPrice,
      totalBalanceUSD: totalBalance.toFixed(2),
    };
  } catch (error) {
    console.error("Error fetching balance:", error);
    return {
      success: false,
      error: "Error fetching balance",
    };
  }
};
