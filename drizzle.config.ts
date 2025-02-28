import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { Configs } from "@/configs/index";

export default defineConfig({
  out: "./drizzle",
  schema: "./database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Configs.db_url,
  },
});
