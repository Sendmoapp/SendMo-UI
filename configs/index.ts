import "dotenv/config";

export const Configs = {
  db_url: process.env.DATABASE_URL,
  ethereum_rpc_url: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL,
  sepolia_rpc_url: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
};
