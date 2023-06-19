import { relations } from "drizzle-orm";
import { bigint, varchar, boolean, pgSchema, index } from "drizzle-orm/pg-core";
import { profile } from "./user";

/**
 * -- https://lucia-auth.com/adapters/drizzle#postgresql
 */

//==================================================================

export const AUTH_SCHEMA = pgSchema("auth");

//==================================================================

export const user = AUTH_SCHEMA.table(
   "user",
   {
      id: varchar("id", {
         length: 15, // change this when using custom user ids
      }).primaryKey(),
      // other user attributes

      // Ensure migration files are modified to make this column unique.
      handle: varchar("handle", { length: 255 }).notNull(),
   },
   (table) => ({
      // Filtering users by their handle is common.
      handleIdx: index("handle_idx").on(table.handle),
   })
);

export const userRelations = relations(user, ({ many, one }) => ({
   keys: many(key),
   session: many(session),
   profile: one(profile, {
      fields: [user.handle],
      references: [profile.handle],
   }),
}));

//==================================================================

export const session = AUTH_SCHEMA.table("session", {
   id: varchar("id", {
      length: 128,
   }).primaryKey(),
   userId: varchar("user_id", {
      length: 15,
   })
      .notNull()
      .references(() => user.id),
   activeExpires: bigint("active_expires", {
      mode: "number",
   }).notNull(),
   idleExpires: bigint("idle_expires", {
      mode: "number",
   }).notNull(),
});

export const sessionRelations = relations(session, ({ one }) => ({
   user: one(user, {
      fields: [session.userId],
      references: [user.id],
   }),
}));

//==================================================================

export const key = AUTH_SCHEMA.table("key", {
   id: varchar("id", {
      length: 255,
   }).primaryKey(),
   userId: varchar("user_id", {
      length: 15,
   })
      .notNull()
      .references(() => user.id),
   primaryKey: boolean("primary_key").notNull(),
   hashedPassword: varchar("hashed_password", {
      length: 255,
   }),
   expires: bigint("expires", {
      mode: "number",
   }),
});

export const keyRelations = relations(key, ({ one }) => ({
   user: one(user, {
      fields: [key.userId],
      references: [user.id],
   }),
}));

//==================================================================
