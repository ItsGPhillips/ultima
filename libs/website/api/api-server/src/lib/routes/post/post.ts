import { router, procedure } from "../../trpc";
import { z } from "zod";
import { db, schema } from "@website/database";
import { SQL, and, asc, desc, eq, inArray, sql } from "drizzle-orm";

import { post } from "libs/website/database/src/schema";
import { Log } from "@website/utils";
import { TRPCError } from "@trpc/server";
import { authenicated } from "../../middleware";
import { syncBuiltinESMExports } from "module";
import { D } from "drizzle-orm/query-promise.d-0dd411fc";

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
   getPosts: procedure.input(GET_POSTS_SCHEMA).query(async ({ input }) => {
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

      if (lastPost === undefined) {
         if (!!input.lastId) {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: `No post with id = ${input.lastId}`,
            });
         }
         return [];
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

   getUserVote: procedure
      .use(authenicated)
      .input(
         z.object({
            postId: z.string(),
         })
      )
      .query(async ({ ctx, input }) => {
         try {
            const currentlyAuthenticatedHandle =
               await db.query.profile.findFirst({
                  where: (profile, { eq }) => eq(profile.id, ctx.auth.userId),
                  columns: {},
                  with: {
                     page: {
                        columns: {
                           handle: true,
                        },
                     },
                  },
               });

            if (!currentlyAuthenticatedHandle) {
               throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }

            const [data] = await db
               .select()
               .from(schema.postVotes)
               .where(
                  and(
                     eq(schema.postVotes.postId, input.postId),
                     eq(
                        schema.postVotes.handle,
                        currentlyAuthenticatedHandle.page.handle
                     )
                  )
               )
               .limit(1);

            return { isUpvote: data?.isUpvote ?? null };
         } catch (e) {
            Log.error(e);
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
         }
      }),

   getVotes: procedure.input(GET_VOTES_SCHEMA).query(async ({ input }) => {
      const [data] = await db
         .select({ votes: schema.post.votes })
         .from(schema.post)
         .where(eq(schema.post.id, input.postId));
         
      if (!data) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      return data;
   }),

   getVotesBatched: procedure
      .input(z.object({ postIds: z.array(z.string()) }))
      .query(async ({ input }) => {
         let query = await db
            .select()
            .from(schema.postVotes)
            .where(inArray(schema.postVotes.postId, input.postIds));
      }),

   upsertPostVoteAction: procedure
      .use(authenicated)
      .input(z.object({ postId: z.string(), isUpvote: z.boolean().nullable() }))
      .mutation(async ({ ctx, input }) => {
         try {
            // TODO: combine these two queries into a single Postgres function.

            const [data] = await db
               .select({ handle: schema.page.handle })
               .from(schema.page)
               .where(eq(schema.page.primaryProfileId, ctx.auth.userId));

            if (!data) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const { handle } = data;

            if (input.isUpvote === null) {
               await db
                  .delete(schema.postVotes)
                  .where(
                     and(
                        eq(schema.postVotes.handle, handle),
                        eq(schema.postVotes.postId, input.postId)
                     )
                  );
               return;
            }

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
