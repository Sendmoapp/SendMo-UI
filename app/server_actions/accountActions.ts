"use server";
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
    const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
      chain: "0xaa36a7",
      order: "DESC",
      address: walletAddress,
    });
    const jsonRes = response.toJSON();

    if (jsonRes.result.length === 0) return [];

    const recieved = jsonRes.result.filter(
      (t) => t.to_address === walletAddress.toLocaleLowerCase()
    );
    const sent = jsonRes.result.filter(
      (t) => t.from_address === walletAddress.toLocaleLowerCase()
    );

    const formattedTrx = recieved
      .concat(sent)
      .map((trx) => {
        return {
          hash: trx.transaction_hash,
          from: trx.from_address,
          to: trx.to_address,
          value: trx.value_decimal,
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
      })
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
    const jsonRes = JSON.parse(JSON.stringify(response.result));

    const { usdtPrice, usdcPrice, ethPrice } = await getTokenPrice([
      "tether",
      "usd-coin",
      "ethereum",
    ]);

    const usdtBalance =
      jsonRes.find((t: any) => t.symbol === "USDT")?.balance_formatted ?? "0";
    const usdcBalance =
      jsonRes.find((t: any) => t.symbol === "USDC")?.balance_formatted ?? "0";
    const ethBalance =
      jsonRes.find((t: any) => t.symbol === "ETH")?.balance_formatted ?? "0";
    const mptBalance =
      jsonRes.find((t: any) => t.symbol === "MPT")?.balance_formatted ?? "0";
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
      mptBalance,
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
