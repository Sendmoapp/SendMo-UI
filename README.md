# SendMo (A Stable Coin Payment App)

SendMo is a stable coin payment system that integrates with Privy for authentication, Moralis for blockchain interactions, and Uniswap for token swaps. The project is built using Next.js and TypeScript.

## Table of Contents

- Features
- Technologies Used
- Project Structure
- Setup Instructions
- Deployment on Vercel

## Features

- User authentication with Privy
- Token balance fetching using Moralis
- Token swapping using Uniswap
- Sending and receiving funds leveraging Privy

## Technologies Used

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Privy](https://privy.io/)
- [Moralis](https://moralis.io/)
- [Uniswap](https://uniswap.org/)
- [Ethers.js](https://docs.ethers.io/v5/)
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
- [PostgreSQL](https://www.postgresql.org/)
- [Neon](https://neon.tech/)

## Setup Instructions

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn
- A Moralis account
- A Privy account
- neon and drizzle account
  Sepolia ETH for gas payment (Get here: https://faucet.africanonchaincollective.xyz/)
  Sepolia USDC (gat here: https://faucet.circle.com/)

### Step-by-Step Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Sendmoapp/SendMo-UI.git
   cd stable_coin_payment

   ```

2. **Install dependencies:**
   npm install

# or

yarn install

3. **Set up environment variables:**
   Create a .env file in the root directory and add the following variables:
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
   NEXT_PUBLIC_MOONPAY_PUBLISHABLE_KEY=your_moonpay_publishable_key
   SEPOLIA_RPC_URL=your_sepolia_rpc_url
   DATABASE_URL=your_postgresql_database_url
   MORALIS_API_KEY=your_moralis_api_key

4. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Deploy on Vercel

This MVP is configured to use sepolia network, all transactions are going to happen on Sepolia Testnet.

Check out our [deployed version on vercel:https://sendmoui-test.vercel.app/](https://sendmoui-test.vercel.app/)
