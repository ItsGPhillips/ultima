import {
   pgTable,
   text,
   timestamp,
   index,
   boolean,
   primaryKey,
   varchar,
   jsonb,
   serial,
   integer,
   foreignKey,
   AnyPgColumn,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { relations } from "drizzle-orm";
import { DATABASE_CUID_LENGTH } from "@website/utils";
import { JSONContent } from "@tiptap/react";
import { on } from "events";

//==================================================================
// Auth schema defined buy lucia-auth
export * from "./auth";

//==================================================================

export const profile = pgTable("profile", {
   id: text("id")
      .notNull()
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
   firstName: text("first_name").notNull(),
   lastName: text("last_name"),
   createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
});

export const profileRelations = relations(profile, ({ one }) => ({
   page: one(page, {
      fields: [profile.id],
      references: [page.primaryProfileId],
   }),
   user: one(user, {
      fields: [profile.id],
      references: [user.id],
   }),
}));

//==================================================================

export const profileMask = pgTable("public_profile_mask", {
   profileId: text("profile_id")
      .notNull()
      .primaryKey()
      .references(() => profile.id, {
         onDelete: "cascade",
         onUpdate: "cascade",
      }),
   name: boolean("name").notNull().default(true),
});

export const profileMaskRelations = relations(profileMask, ({ one }) => ({
   profile: one(profile, {
      fields: [profileMask.profileId],
      references: [profile.id],
   }),
}));

//==================================================================

export const page = pgTable(
   "page",
   {
      handle: text("handle").notNull().primaryKey(),
      primaryProfileId: text("primary_profile_id").references(
         () => profile.id,
         {
            onDelete: "cascade",
            onUpdate: "cascade",
         }
      ),
      title: text("title").notNull(),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .notNull()
         .defaultNow(),
      details: text("details").notNull().default(""),
      allowExternal: boolean("allow_external").notNull().default(false),
      accentColor: varchar("accent_color", { length: 7 }).notNull(),
   },
   (table) => ({
      primaryProfileIdIdx: index("primary_profile_id_idx").on(
         table.primaryProfileId
      ),
   })
);

export const pageRelations = relations(page, ({ one, many }) => ({
   profile: one(profile, {
      fields: [page.primaryProfileId],
      references: [profile.id],
   }),
   badges: many(pageBadge),
   moderators: many(pageModerators, {
      relationName: "page_moderator",
   }),
}));

//==================================================================

export const pageBadge = pgTable(
   "page_badge",
   {
      handle: text("handle").references(() => page.handle, {
         onDelete: "cascade",
         onUpdate: "cascade",
      }),
      name: text("name").notNull(),
   },
   (table) => ({
      pk: primaryKey(table.handle, table.name),
   })
);

export const pageBadgeRelations = relations(pageBadge, ({ one }) => ({
   profile: one(page, {
      fields: [pageBadge.handle],
      references: [page.handle],
   }),
}));

//==================================================================

export const pageModerators = pgTable(
   "page_moderators",
   {
      pageHandle: text("handle").references(() => page.handle, {
         onDelete: "cascade",
         onUpdate: "cascade",
      }),
      moderatorHandle: text("name").notNull(),
   },
   (table) => ({
      pk: primaryKey(table.pageHandle, table.moderatorHandle),
   })
);

export const pageModeratorsRelations = relations(pageModerators, ({ one }) => ({
   moderator: one(page, {
      relationName: "page_moderator",
      fields: [pageModerators.moderatorHandle],
      references: [page.handle],
   }),
   page: one(page, {
      relationName: "moderated_page",
      fields: [pageModerators.pageHandle],
      references: [page.handle],
   }),
}));

//==================================================================

export const subscription = pgTable(
   "subscription",
   {
      handle: text("handle")
         .notNull()
         .references(() => page.handle, {
            onDelete: "cascade",
            onUpdate: "cascade",
         }),
      profileId: text("profile_id")
         .notNull()
         .references(() => profile.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
         }),
      subscribedAt: timestamp("subscribed_at", {
         withTimezone: true,
         mode: "string",
      })
         .notNull()
         .defaultNow(),
   },
   (table) => ({
      pk: primaryKey(table.handle, table.profileId),
   })
);

export const subscriptionRel = relations(subscription, ({ one }) => ({
   page: one(page, {
      fields: [subscription.handle],
      references: [page.handle],
   }),
   profile: one(profile, {
      fields: [subscription.profileId],
      references: [profile.id],
   }),
}));

//==================================================================

export const post = pgTable("post", {
   id: varchar("id", { length: DATABASE_CUID_LENGTH }).primaryKey(),
   handle: text("handle")
      .notNull()
      .references(() => page.handle, {
         onDelete: "cascade",
         onUpdate: "cascade",
      }),

   posterHandle: text("poster_handle")
      .notNull()
      .references(() => page.handle, {
         onDelete: "cascade",
         onUpdate: "cascade",
      }),

   postedAt: timestamp("posted_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
   body: jsonb("body").notNull().$type<JSONContent>(),
   images: text("image_urls").array(),
   votes: integer("votes").default(0).notNull(),
});

export const postRel = relations(post, ({ one, many }) => ({
   page: one(page, {
      fields: [post.handle],
      references: [page.handle],
   }),
   posterPage: one(page, {
      fields: [post.posterHandle],
      references: [page.handle],
   }),
   votesRelation: many(postVotes),
}));

//==================================================================

export const postVotes = pgTable(
   "post_votes",
   {
      postId: varchar("post_id", { length: DATABASE_CUID_LENGTH })
         .notNull()
         .references(() => post.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
         }),
      handle: text("handle")
         .notNull()
         .references(() => page.handle, {
            onDelete: "cascade",
            onUpdate: "cascade",
         }),
      isUpvote: boolean("is_upvote").notNull(),
   },
   (table) => ({
      pk: primaryKey(table.postId, table.handle),
   })
);

export const postVotesRel = relations(postVotes, ({ one }) => ({
   post: one(post, {
      fields: [postVotes.postId],
      references: [post.id],
   }),
   page: one(page, {
      fields: [postVotes.handle],
      references: [page.handle],
   }),
}));

//==================================================================

export const userUploadedMedia = pgTable("user_uploaded_media", {
   id: serial("id").notNull().primaryKey(),
   profileId: text("profile_id")
      .notNull()
      .references(() => profile.id, {
         onDelete: "cascade",
         onUpdate: "cascade",
      }),
   handle: text("handle")
      .notNull()
      .references(() => page.handle, {
         onDelete: "cascade",
         onUpdate: "cascade",
      }),
   url: text("url").notNull(),
   type: text("type", { enum: ["image", "video"] }).notNull(),
});

export const userUploadedMediaRel = relations(userUploadedMedia, ({ one }) => ({
   page: one(page, {
      fields: [userUploadedMedia.handle],
      references: [page.handle],
   }),
   profile: one(profile, {
      fields: [userUploadedMedia.profileId],
      references: [profile.id],
   }),
}));

//==================================================================

export const comment = pgTable("post_comments", {
   id: serial("id").notNull().primaryKey(),
   handle: text("handle")
      .notNull()
      .references(() => page.handle, {
         onDelete: "cascade",
         onUpdate: "cascade",
      }),
   postId: varchar("post_id", { length: DATABASE_CUID_LENGTH })
      .notNull()
      .references(() => post.id, {
         onDelete: "cascade",
         onUpdate: "cascade",
      }),
   parentId: integer("parent_id").references((): AnyPgColumn => comment.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
   }),
   postedAt: timestamp("posted_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
   comment: text("comment").notNull(),
});

export const commentRel = relations(comment, ({ one, many }) => ({
   page: one(page, {
      fields: [comment.handle],
      references: [page.handle],
   }),
   post: one(post, {
      fields: [comment.postId],
      references: [post.id],
   }),
   parent: one(comment, {
      relationName: "parent_rel",
      fields: [comment.parentId],
      references: [comment.id],
   }),
   replies: many(comment, { relationName: "parent_rel" }),
}));
