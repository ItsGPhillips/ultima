import { relations } from "drizzle-orm";
import {
   text,
   timestamp,
   primaryKey,
   index,
   boolean,
   pgSchema,
} from "drizzle-orm/pg-core";

//==================================================================

export const PAGE_SCHEMA = pgSchema("page");

//==================================================================

export const group = PAGE_SCHEMA.table("group", {
   id: text("id").notNull().primaryKey(),
   name: text("name").notNull(),
   createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
   description: text("description").notNull().default(""),
   isPrivate: boolean("is_private").notNull().default(false),
});

export const pageRel = relations(group, ({ many }) => ({
   badges: many(groupBadge),
}));

//==================================================================

export const groupBadge = PAGE_SCHEMA.table(
   "group_badge",
   {
      groupId: text("group_id").notNull(),
      name: text("name").notNull(),
   },
   (self) => ({
      pk: primaryKey(self.groupId, self.name),
      pageIdx: index("badge_page_idx").on(self.groupId),
   })
);

export const pageBadgeRel = relations(groupBadge, ({ one }) => ({
   group: one(group, {
      fields: [groupBadge.groupId],
      references: [group.id],
   }),
}));
