import type { Config } from "drizzle-kit";
import { env } from "~/env.mjs";

export default {
   schema: "./src/server/database/schema/",
   out: "./src/server/database/migrations",
   connectionString: process.env.DATABASE_URL,
} satisfies Config;
