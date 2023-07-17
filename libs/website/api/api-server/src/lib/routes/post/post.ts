import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { db, schema } from "@website/database";
import { SQL, and, asc, desc, eq, inArray, sql } from "drizzle-orm";

import { post } from "libs/website/database/src/schema";
import { Log } from "@website/utils";
import { TRPCError } from "@trpc/server";
import { authenicated } from "../../middleware";
import { syncBuiltinESMExports } from "module";

const GET_POST_VARIANTS = z
   .object({
      homeFeed: z.literal(true),
   })
   .or(
      z.object({
         homeFeed: z.literal(false).optional(),
         handle: z.string(),
      })
   );

const GET_POSTS_SCHEMA = z
   .object({
      filter: z.enum(["NEWEST"]),
      lastId: z.string().nonempty().optional(),
      limit: z.number().min(1).default(5),
   })
   .and(GET_POST_VARIANTS);

const GET_VOTES_SCHEMA = z.object({
   postId: z.string(),
});

export const postsRouter = router({
   getPosts: publicProcedure
      .input(GET_POSTS_SCHEMA)
      .query(async ({ input }) => {
         let query = db
            .select({ postedAt: schema.post.postedAt })
            .from(schema.post);

         if (input.lastId) {
            query = query.where(eq(schema.post.id, input.lastId));
         } else if (!input.homeFeed) {
            query = query.where(eq(schema.post.handle, input.handle));
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

         switch (input.filter) {
            case "NEWEST": {
               try {
                  const filters: Array<SQL> = [
                     input.lastId !== undefined
                        ? sql`${schema.post.postedAt} < ${lastPost.postedAt}::TIMESTAMP`
                        : sql`${schema.post.postedAt} <= ${lastPost.postedAt}::TIMESTAMP`,
                  ];

                  if (!input.homeFeed) {
                     filters.push(eq(schema.post.handle, input.handle));
                  }

                  return await db
                     .select()
                     .from(post)
                     .where(and(...filters))
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
   getVotes: publicProcedure
      .input(GET_VOTES_SCHEMA)
      .query(async ({ input }) => {
         const votes = await db
            .select()
            .from(schema.postVotes)
            .where(eq(schema.postVotes.postId, input.postId));
      }),

      
   getVotesBatched: publicProcedure
      .input(z.object({ postIds: z.array(z.string()) }))
      .query(async ({ input }) => {
         let query = await db
            .select()
            .from(schema.postVotes)
            .where(inArray(schema.postVotes.postId, input.postIds));
      }),

   upsertPostVoteAction: publicProcedure
      .use(authenicated)
      .input(z.object({ postId: z.string(), isUpvote: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
         try {
            // TODO: combine these two queries into a single Postgres function.

            const [data] = await db
               .select({ handle: schema.page.handle })
               .from(schema.page)
               .where(eq(schema.page.primaryProfileId, ctx.auth.userId));

            if (!data) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const { handle } = data;

            const payload = {
               handle,
               isUpvote: input.isUpvote,
               postId: input.postId,
            };

            await db
               .insert(schema.postVotes)
               .values(payload)
               .onConflictDoUpdate({
                  set: {
                     isUpvote: payload.isUpvote,
                  },
                  target: [schema.postVotes.handle, schema.postVotes.postId],
               });
         } catch (e) {
            Log.error(e);
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
         }
      }),
});
