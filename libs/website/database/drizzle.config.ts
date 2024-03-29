import "drizzle-orm";
import type { Config } from "drizzle-kit";

export default {
   schema: "./src/schema/index.ts",
   out: "./migrations",
   driver: "pg",
   dbCredentials: {
      connectionString: process.env["DATABASE_URL"]!,
   },
} satisfies Config;
