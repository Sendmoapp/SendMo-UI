import { Configs } from "@/configs/index";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(Configs.db_url!);

export const db = drizzle({ client: sql });
