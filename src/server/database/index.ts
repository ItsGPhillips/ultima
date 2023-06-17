import postgres from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "~/env.mjs";

import * as user from "./schema/user";

const pool = new postgres.Pool({
   connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema: { ...user } });
