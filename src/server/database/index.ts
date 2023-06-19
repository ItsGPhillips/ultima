import postgres from "pg";
import {
   NodePgDatabase,
   NodePgQueryResultHKT,
   drizzle,
} from "drizzle-orm/node-postgres";
import { env } from "~/env.mjs";
import { PgTransaction } from "drizzle-orm/pg-core";

import * as user_schema from "./schema/user";
import * as auth_schema from "./schema/auth";
import * as page_schema from "./schema/page";

const pool = new postgres.Pool({
   connectionString: env.DATABASE_URL,
});

const schema = {
   ...user_schema,
   ...auth_schema,
   ...page_schema,
} as const;

export const db = drizzle(pool, { schema });

export type Database =
   | NodePgDatabase<typeof schema>
   | PgTransaction<NodePgQueryResultHKT, typeof schema>;
