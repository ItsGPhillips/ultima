import {
   pgTable,
   text,
   timestamp,
   index,
   boolean,
   varchar,
   primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { CUID_LENGTH } from "~/utils/cuid";

//==================================================================

export const profile = pgTable("profile", {
   handle: text("handle").notNull().primaryKey(),
   clerkId: text("clerk_user_id").notNull(),
});

export const profileRef = relations(profile, ({ many }) => ({
   subscription: many(subscription),
}));

//==================================================================

export const group = pgTable("group", {
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

export const groupBadge = pgTable(
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

//==================================================================

export const post = pgTable("post", {
   id: varchar("id", { length: CUID_LENGTH }).primaryKey(),
   groupId: text("group_id")
      .notNull()
      .references(() => group.id),
   profileHandle: text("profile_handle")
      .notNull()
      .references(() => profile.handle),

   //---------------------------------------------------

   postedAt: timestamp("posted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
   title: text("title").notNull(),
   body: text("body"),
});

export const postRel = relations(post, ({ one }) => ({
   group: one(group, {
      fields: [post.groupId],
      references: [group.id],
   }),
   profileHandle: one(profile, {
      fields: [post.profileHandle],
      references: [profile.handle],
   }),
}));

//==================================================================

export const postVotes = pgTable(
   "post_votes",
   {
      postId: varchar("post_id", { length: CUID_LENGTH })
         .notNull()
         .references(() => post.id, { onDelete: "cascade" }),
      groupId: text("group_id")
         .notNull()
         .references(() => group.id, { onDelete: "cascade" }),
      profileHandle: text("profile_handle")
         .notNull()
         .references(() => profile.handle),
      isUpvote: boolean("is_upvote").notNull(),
   },
   (self) => ({
      pk: primaryKey(self.postId, self.groupId),
   })
);

export const postVotesRel = relations(postVotes, ({ one }) => ({
   group: one(group, {
      fields: [postVotes.groupId],
      references: [group.id],
   }),
   post: one(post, {
      fields: [postVotes.postId],
      references: [post.id],
   }),
   profile: one(profile, {
      fields: [postVotes.profileHandle],
      references: [profile.handle],
   }),
}));

//==================================================================

export const subscription = pgTable(
   "subscription",
   {
      groupId: text("page_id")
         .notNull()
         .references(() => group.id, { onDelete: "cascade" }),
      profileHandle: text("profile_handle")
         .notNull()
         .references(() => profile.handle, { onDelete: "cascade" }),
      subscribedAt: timestamp("subscribed_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (self) => ({
      pk: primaryKey(self.groupId, self.profileHandle),
   })
);

export const subscriptionRel = relations(subscription, ({ one }) => ({
   group: one(group, {
      fields: [subscription.groupId],
      references: [group.id],
   }),
   profile: one(profile, {
      fields: [subscription.profileHandle],
      references: [profile.handle],
   }),
}));

// //==================================================================
