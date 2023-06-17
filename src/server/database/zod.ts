import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { group, post } from "./schema/user";

export const PAGE_TABLE_SCHEMA = createSelectSchema(group);

export const POST_TABLE_SCHEMA = {
   insert: createInsertSchema(post),
   select: createSelectSchema(post),
};
