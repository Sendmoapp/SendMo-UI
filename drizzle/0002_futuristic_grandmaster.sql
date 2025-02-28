ALTER TABLE "users" RENAME COLUMN "balance" TO "total_crypto_balance";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "total_usd_balance" integer DEFAULT 0 NOT NULL;