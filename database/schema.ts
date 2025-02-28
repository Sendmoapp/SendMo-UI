import {
  doublePrecision,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const trx_type = pgEnum("trx_type", [
  "FUNDING",
  "SEND",
  "RECEIVE",
  "CONVERSION",
]);

const status = pgEnum("status", ["PENDING", "SUCCESSFUL", "FAILED"]);
// const kycLevel = pgEnum("kyc_level", ["NONE", "TIER_1", "TIER_2"]);
// const kycStatus = pgEnum("kyc_status", ["PENDING", "APPROVED", "REJECTED"]);
export const userSchema = pgTable("users", {
  id: uuid("id").primaryKey().unique().defaultRandom().notNull(),
  userId: text("user_id").notNull().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  username: text("username").notNull().unique(),
  walletAddress: varchar("wallet_address", { length: 255 }).notNull().unique(),
  totalUsdBalance: integer("total_usd_balance").default(0).notNull(),
  totalCryptoBalance: integer("total_crypto_balance").default(0).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  lastUpdatedAt: timestamp("last_updated_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().unique().defaultRandom().notNull(),
  userId: text("user_id").notNull(),
  type: trx_type("type").notNull().default("FUNDING"),
  token: text("token").notNull(),
  chainId: text("chain_id").notNull(),
  amount: numeric("amount", { precision: 18, scale: 6 }).notNull(),
  fee: numeric("fee", { precision: 18, scale: 6 }).default("0"),
  networkFee: numeric("network_fee", { precision: 18, scale: 6 }).default("0"),
  recipient: text("recipient").notNull(),
  txHash: text("tx_hash"),
  status: status("status").default("PENDING").notNull(),
  errorMessage: text("error_message"), // Stores failure reason if any
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
