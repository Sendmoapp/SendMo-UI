import { atom } from "jotai";

export const userAccountAtom = atom<{
  usdtBalance: number;
  usdcBalance: number;
  ethBalance: number;
  mptBalance: number;
  totalCryptoBalance: number;
} | null>(null);

export const transactionsAtom = atom<
  {
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
  }[]
>([]);
