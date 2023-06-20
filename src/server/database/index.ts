import postgres from "pg";
import {
   NodePgDatabase,
   NodePgQueryResultHKT,
   drizzle,
} from "drizzle-orm/node-postgres";
import { env } from "~/env.mjs";
import { PgTransaction } from "drizzle-orm/pg-core";

import * as schema from "./schema";

const pool = new postgres.Pool({
   connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type Database =
   | NodePgDatabase<typeof schema>
   | PgTransaction<NodePgQueryResultHKT, typeof schema>;
