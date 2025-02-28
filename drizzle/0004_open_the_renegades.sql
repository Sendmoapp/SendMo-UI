CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "trx_type" DEFAULT 'FUNDING' NOT NULL,
	"token" text NOT NULL,
	"chain_id" text NOT NULL,
	"amount" numeric(18, 6) NOT NULL,
	"fee" numeric(18, 6) DEFAULT '0',
	"network_fee" numeric(18, 6) DEFAULT '0',
	"recipient" text NOT NULL,
	"tx_hash" text,
	"status" "status" DEFAULT 'PENDING' NOT NULL,
	"error_message" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_id_unique" UNIQUE("id")
);
