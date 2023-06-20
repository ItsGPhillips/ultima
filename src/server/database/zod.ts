import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Table, TableConfig } from "drizzle-orm";

import { user, session, key } from "./schema/auth";
import { page, post, profile } from "./schema";

const makeSchemas = <T extends TableConfig>(table: Table<T>) => ({
   insert: createInsertSchema(table),
   select: createSelectSchema(table),
});

export const PAGE_TABLE_SCHEMA = makeSchemas(page);
export const POST_TABLE_SCHEMA = makeSchemas(post);
export const PROFILE_TABLE_SCHEMA = makeSchemas(profile);

export namespace Auth {
   export const USER_TABLE_SCHEMA = makeSchemas(user);
   export const SESSION_TABLE_SCHEMA = makeSchemas(session);
   export const KEY_TABLE_SCHEMA = makeSchemas(key);
}
