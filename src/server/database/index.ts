import postgres from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "~/env.mjs";
import { pg } from "@lucia-auth/adapter-postgresql";
import lucia from "lucia-auth";

const pool = new postgres.Pool({
   connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool);

export const auth = lucia({
   adapter: pg(pool),
   csrfProtection: true,
   env: env.NODE_ENV === "production" ? "PROD" : "DEV",
   transformDatabaseUser: (data) => {
      return {
         userId: data.id,
         name: data.name,
      };
   },
});

export type Auth = typeof auth;
