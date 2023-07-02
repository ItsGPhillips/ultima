"use server";

import { desc, eq, sql } from "drizzle-orm";
import { db } from "../database";
import { page, post } from "../database/schema";
import { Post } from "../database/types";
import { withAuth } from "./utils";
import { cuid } from "~/utils/cuid";
import { Log } from "~/utils/log";
import { subDays } from "date-fns";
import superjson from "superjson";
import { JSONContent } from "@tiptap/react";

const POSTS_PER_REQUEST_LIMIT = 5;

// export const hasMorePostsAction = async (options: {
//    handle: string;
//    sortBy: "NEWEST";
//    lastPost: {
//       id: string;
//       postedAt: string;
//    } | null;
// }) => {
//    if (!options.lastPost) {
//       const [row] = await db
//          .select({ id: post.id })
//          .from(post)
//          .where(sql`${post.handle} = ${options.handle}`)
//          .orderBy(desc(post.postedAt))
//          .limit(1);

//       return row !== undefined;
//    }

//    console.log("got herer", options.lastPost)

//    const [row] = await db
//       .select({ id: post.id })
//       .from(post)
//       .where(
//          sql`${post.handle} = ${options.handle} AND
//          ${post.postedAt} < ${options.lastPost.postedAt}::TIMESTAMP`
//       )
//       .orderBy(desc(post.postedAt))
//       .limit(1);

//    console.log("row", row)

//    return row !== undefined;
// };

export const getPostsAction = async (options: {
   handle: string;
   sortBy: "NEWEST";
   lastPost: {
      id: string;
      postedAt: string;
   } | null;
}) => {
   // Get the first posts.
   if (!options.lastPost) {
      return await db
         .select()
         .from(post)
         .where(sql`${post.handle} = ${options.handle}`)
         .orderBy(desc(post.postedAt))
         .limit(POSTS_PER_REQUEST_LIMIT);
   }

   return await db
      .select()
      .from(post)
      .where(
         sql`${post.handle} = ${options.handle} AND 
         ${post.postedAt} < ${options.lastPost.postedAt}::TIMESTAMP`
      )
      .orderBy(desc(post.postedAt))
      .limit(POSTS_PER_REQUEST_LIMIT);
};

export const createPostAction = withAuth(
   async (
      user,
      data: Omit<Post<"insert">, "id" | "posterHandle" | "body"> & { body: any }
   ) => {
      const [currentUser] = await db
         .select({
            handle: page.handle,
         })
         .from(page)
         .where(eq(page.primaryProfileId, user.id))
         .limit(1);

      if (!currentUser) throw new Error("INVALID_DATABASE_STATE");

      console.log("create post action", data?.images);

      const payload = {
         id: cuid(),
         handle: data.handle,
         images: data.images,
         posterHandle: currentUser.handle,
         body: superjson.deserialize<JSONContent>(data.body),
      } satisfies Post<"insert">;

      try {
         await db.insert(post).values(payload).returning();
      } catch (e) {
         Log.error(e, "createPostAction");
      }
   }
);
