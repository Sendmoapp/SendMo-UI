import "dotenv/config";
if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
  throw new Error("Please provide DATABASE_URL");
}
export const Configs = {
  db_url: process.env.NEXT_PUBLIC_DATABASE_URL,
  ethereum_rpc_url: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL,
  sepolia_rpc_url: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
  bsc_rpc_url: process.env.NEXT_PUBLIC_BSC_RPC_URL,
  polygon_rpc_url: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
  base_rpc_url: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  arbitrum_rpc_url: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL,
};
