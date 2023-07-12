import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { db, schema } from "@website/database";
import { SQL, and, asc, desc, eq, sql } from "drizzle-orm";

import { post } from "libs/website/database/src/schema";
import { Log } from "@website/utils";
import { TRPCError } from "@trpc/server";

const GET_POSTS_SCHEMA = z.object({
   filter: z.enum(["NEWEST"]),
   lastId: z.string().nonempty().optional(),
   limit: z.number().min(1).default(5),
});

export const postsRouter = router({
   getPage: publicProcedure
      .input(GET_POSTS_SCHEMA.extend({ handle: z.string() }))
      .query(async ({ input }) => {
         Log.debug(input.lastId);

         let query = db
            .select({ postedAt: schema.post.postedAt })
            .from(schema.post);

         if (input.lastId) {
            query = query.where(eq(schema.post.id, input.lastId));
         } else {
            query = query.where(eq(schema.post.handle, input.handle));
         }

         const [data] = await query.limit(1);

         if (!data) {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: `No post with id = ${input.lastId}`,
            });
         }

         switch (input.filter) {
            case "NEWEST": {
               try {
                  const filterTimestamp = !!input.lastId
                     ? sql`${schema.post.postedAt} > ${data.postedAt}::TIMESTAMP`
                     : sql`${schema.post.postedAt} >= ${data.postedAt}::TIMESTAMP`;

                  const filterHandle = eq(schema.post.handle, input.handle);

                  return await db
                     .select()
                     .from(post)
                     .where(and(filterHandle, filterTimestamp))
                     .orderBy(asc(schema.post.postedAt))
                     .limit(input.limit);
               } catch (e) {
                  console.log(e);
                  return [];
               }
            }
            default:
               throw "unimplimented";
         }
      }),
   getHomeFeed: publicProcedure
      .input(GET_POSTS_SCHEMA)
      .query(async ({ input }) => {
         let query = db
            // .select({ postedAt: schema.post.postedAt })
            .select()
            .from(schema.post);

         if (input.lastId) {
            Log.debug({ lastId: input.lastId }, "lastId");
            query = query.where(eq(schema.post.id, input.lastId));
         }

         const [lastPost] = await query
            .orderBy(desc(schema.post.postedAt))
            .limit(1);

         if (!lastPost) {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: `No post with id = ${input.lastId}`,
            });
         }

         console.log(JSON.stringify(lastPost.body));

         switch (input.filter) {
            case "NEWEST": {
               try {
                  const filter =
                     input.lastId !== undefined
                        ? sql`${schema.post.postedAt} < ${lastPost.postedAt}::TIMESTAMP`
                        : sql`${schema.post.postedAt} <= ${lastPost.postedAt}::TIMESTAMP`;

                  return await db
                     .select()
                     .from(post)
                     .where(filter)
                     .orderBy(desc(schema.post.postedAt))
                     .limit(input.limit);
               } catch (e) {
                  console.log(e);
                  return [];
               }
            }
            default:
               throw "unimplimented";
         }
      }),
});
