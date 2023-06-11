import { pgSchema, text, primaryKey } from "drizzle-orm/pg-core";

import { pgTable, bigint, varchar, boolean } from "drizzle-orm/pg-core";

/**
 * https://lucia-auth.com/adapters/drizzle
 */

export const AuthUser = pgTable("auth_user", {
   id: varchar("id", {
      length: 15,
   }).primaryKey(),
   // TODO (George): other user attributes
});

export const AuthSession = pgTable("auth_session", {
   id: varchar("id", {
      length: 128,
   }).primaryKey(),
   userId: varchar("user_id", {
      length: 15,
   })
      .notNull()
      .references(() => AuthUser.id),
   activeExpires: bigint("active_expires", {
      mode: "number",
   }).notNull(),
   idleExpires: bigint("idle_expires", {
      mode: "number",
   }).notNull(),
});

export const AuthKey = pgTable("auth_key", {
   id: varchar("id", {
      length: 255,
   }).primaryKey(),
   userId: varchar("user_id", {
      length: 15,
   })
      .notNull()
      .references(() => AuthUser.id),
   primaryKey: boolean("primary_key").notNull(),
   hashedPassword: varchar("hashed_password", {
      length: 255,
   }),
   expires: bigint("expires", {
      mode: "number",
   }),
});
