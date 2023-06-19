import {
   text,
   timestamp,
   boolean,
   varchar,
   primaryKey,
   pgSchema,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { CUID_LENGTH } from "~/utils/cuid";
import { user } from "./auth";
import { group } from "./page";

//==================================================================

export const USER_SCHEMA = pgSchema("user");

//==================================================================

export const profile = USER_SCHEMA.table("profile", {
   handle: text("handle")
      .notNull()
      .primaryKey()
      .references(() => user.handle, {
         onDelete: "cascade",
         onUpdate: "cascade",
      }),
   firstName: text("first_name").notNull(),
   lastName: text("last_name"),
   createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
   //TODO
   // - images
   // - age
   // - other data.
});

export const profileRef = relations(profile, ({ many }) => ({
   subscription: many(subscription),
}));

//==================================================================

export const post = USER_SCHEMA.table("post", {
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

export const postVotes = USER_SCHEMA.table(
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

export const subscription = USER_SCHEMA.table(
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
