import FACTORY_ABI from "@/constants/abis/factory.json" assert { type: "json" };
import POOL_ABI from "@/constants/abis/pool.json" assert { type: "json" };
import QUOTER_ABI from "@/constants/abis/quoter.json" assert { type: "json" };
import SWAP_ROUTER_ABI from "@/constants/abis/swaprouter.json" assert { type: "json" };
import "dotenv/config";
import { BigNumber, ethers } from "ethers";

// Deployment Addresses
const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";
const QUOTER_CONTRACT_ADDRESS = "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3";
const SWAP_ROUTER_CONTRACT_ADDRESS =
  "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";

// Provider, Contract & Signer Instances
const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!
);
const factoryContract = new ethers.Contract(
  POOL_FACTORY_CONTRACT_ADDRESS,
  FACTORY_ABI,
  provider
);
const quoterContract = new ethers.Contract(
  QUOTER_CONTRACT_ADDRESS,
  QUOTER_ABI,
  provider
);

// const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

// Token Configuration
const WETH = {
  chainId: 11155111,
  address: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
  decimals: 18,
  symbol: "WETH",
  name: "Wrapped Ether",
  isToken: true,
  isNative: true,
  wrapped: true,
};

const USDC = {
  chainId: 11155111,
  address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  decimals: 6,
  symbol: "USDC",
  name: "USD//C",
  isToken: true,
  isNative: true,
  wrapped: false,
};

export async function approveToken({
  tokenAddress,
  tokenABI,
  amount,
  wallet,
}: {
  tokenAddress: string;
  tokenABI: any;
  amount: string;
  wallet: any;
}) {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);

    const approveTransaction = await tokenContract.populateTransaction.approve(
      SWAP_ROUTER_CONTRACT_ADDRESS,
      ethers.utils.parseEther(amount)
    );

    const transactionResponse = await wallet.sendTransaction(
      approveTransaction
    );

    console.log(`-------------------------------`);
    console.log(`Sending Approval Transaction...`);
    console.log(`-------------------------------`);
    console.log(`Transaction Sent: ${transactionResponse.hash}`);
    console.log(`-------------------------------`);
    const receipt = await transactionResponse.wait();
    console.log(
      `Approval Transaction Confirmed! https://sepolia.etherscan.io/txn/${receipt.hash}`,
      receipt
    );
  } catch (error) {
    console.error("An error occurred during token approval:", error);
    throw new Error("Token approval failed");
  }
}

export async function getPoolInfo({
  factoryContract,
  tokenIn,
  tokenOut,
}: {
  factoryContract: any;
  tokenIn: any;
  tokenOut: any;
}) {
  const poolAddress = await factoryContract.getPool(
    tokenIn.address,
    tokenOut.address,
    3000
  );
  if (!poolAddress) {
    throw new Error("Failed to get pool address");
  }
  const poolContract = new ethers.Contract(poolAddress, POOL_ABI, provider);
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);
  return { poolContract, token0, token1, fee };
}

export async function quoteAndLogSwap({
  fee,
  signer,
  amountIn,
}: {
  fee: number;
  signer: any;
  amountIn: any;
}) {
  try {
    const amount = ethers.utils.parseEther(amountIn.toString());
    const quotedAmountOut =
      await quoterContract.callStatic.quoteExactInputSingle({
        tokenIn: WETH.address,
        tokenOut: USDC.address,
        fee: fee,
        recipient: await signer.getAddress(),
        deadline: Math.floor(new Date().getTime() / 1000 + 60 * 10),
        amountIn: amount,
        sqrtPriceLimitX96: 0,
      });
    console.log(`-------------------------------`);
    console.log(
      `Token Swap will result in: ${ethers.utils.formatUnits(
        quotedAmountOut[0].toString(),
        USDC.decimals
      )} ${USDC.symbol} for ${ethers.utils.formatEther(amount)} ${WETH.symbol}`
    );
    const amountOut = ethers.utils.formatUnits(quotedAmountOut[0], 6);
    return amountOut;
  } catch (error) {
    console.error("An error occurred during quote fetch:", error);
    throw new Error("Quote fetch failed");
  }
}

async function prepareSwapParams({
  poolContract,
  signer,
  amountIn,
  amountOut,
}: {
  poolContract: any;
  signer: any;
  amountIn: any;
  amountOut: any;
}) {
  return {
    tokenIn: WETH.address,
    tokenOut: USDC.address,
    fee: await poolContract.fee(),
    recipient: await signer.getAddress(),
    amountIn: amountIn,
    amountOutMinimum: amountOut,
    sqrtPriceLimitX96: 0,
  };
}

export async function executeSwap({
  signer,
  amountIn,
  quotedAmountOut,
}: {
  signer: any;
  amountIn: any;
  quotedAmountOut: any;
}) {
  const swapRouter = new ethers.Contract(
    SWAP_ROUTER_CONTRACT_ADDRESS,
    SWAP_ROUTER_ABI,
    signer
  );
  const { poolContract, token0, token1, fee } = await getPoolInfo({
    factoryContract,
    tokenIn: WETH,
    tokenOut: USDC,
  });

  const params = await prepareSwapParams({
    poolContract,
    signer,
    amountIn,
    amountOut: quotedAmountOut,
  });

  console.log({ params });
  const transaction = await swapRouter.populateTransaction.exactInputSingle(
    params
  );
  transaction.gasLimit = BigNumber.from("300000");
  const tx = await signer.sendTransaction(transaction);
  const receipt = await tx.wait();

  console.log(`-------------------------------`);
  console.log(`Receipt: https://sepolia.etherscan.io/tx/${receipt}`);
  console.log(`-------------------------------`, receipt);
  return receipt;
}

// async function main(swapAmount: number) {
//   const inputAmount = swapAmount;
//   const amountIn = ethers.utils.parseUnits(inputAmount.toString(), 18);

//   try {
//     await approveToken({
//       tokenAddress: WETH.address,
//       tokenABI: TOKEN_IN_ABI,
//       amount: amountIn,
//       wallet: signer,
//     });
//     const { poolContract, token0, token1, fee } = await getPoolInfo({
//       factoryContract,
//       tokenIn: WETH,
//       tokenOut: USDC,
//     });
//     console.log(`-------------------------------`);
//     console.log(`Fetching Quote for: ${WETH.symbol} to ${USDC.symbol}`);
//     console.log(`-------------------------------`);
//     console.log(`Swap Amount: ${ethers.utils.formatEther(amountIn)}`);

//     const quotedAmountOut = await quoteAndLogSwap({
//       quoterContract,
//       fee,
//       signer,
//       amountIn,
//     });

// const params = await prepareSwapParams({
//   poolContract,
//   signer,
//   amountIn,
//   amountOut: quotedAmountOut[0].toString(),
// });
// const swapRouter = new ethers.Contract(
//   SWAP_ROUTER_CONTRACT_ADDRESS,
//   SWAP_ROUTER_ABI,
//   signer
// );
//     await executeSwap({ swapRouter, params, signer });
//   } catch (error: any) {
//     console.error("An error occurred:", error.message);
//   }
// }

// main(0.0001);
