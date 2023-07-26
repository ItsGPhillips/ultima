import pg from "pg";

import {
   NodePgDatabase,
   NodePgQueryResultHKT,
   drizzle,
} from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";

import { env } from "../../env/src/index.mjs";

import * as schema from "./schema";

const pool = new pg.Pool({
   connectionString: env.DATABASE_URL,
});

console.log(env);

export const db = drizzle(pool, { schema });

export type Database =
   | NodePgDatabase<typeof schema>
   | PgTransaction<NodePgQueryResultHKT, typeof schema>;

export * from "./types";
export * as zod from "./zod";
export * as schema from "./schema";
