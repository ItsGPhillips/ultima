import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { db, schema } from "@website/database";
import { SQL, and, asc, desc, eq, sql } from "drizzle-orm";

import { post } from "libs/website/database/src/schema";
import { Log } from "@website/utils";
import { TRPCError } from "@trpc/server";

const VARIANTS = z
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
   .and(VARIANTS);

type WAT = z.infer<typeof GET_POSTS_SCHEMA>

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

   // getHomeFeed: publicProcedure
   //    .input(GET_POSTS_SCHEMA)
   //    .query(async ({ input }) => {
   //       let query = db
   //          // .select({ postedAt: schema.post.postedAt })
   //          .select()
   //          .from(schema.post);

   //       if (input.lastId) {
   //          Log.debug({ lastId: input.lastId }, "lastId");
   //          query = query.where(eq(schema.post.id, input.lastId));
   //       }

   //       const [lastPost] = await query
   //          .orderBy(desc(schema.post.postedAt))
   //          .limit(1);

   //       if (!lastPost) {
   //          throw new TRPCError({
   //             code: "BAD_REQUEST",
   //             message: `No post with id = ${input.lastId}`,
   //          });
   //       }

   //       console.log(JSON.stringify(lastPost.body));

   //       switch (input.filter) {
   //          case "NEWEST": {
   //             try {
   //                const filter =
   //                   input.lastId !== undefined
   //                      ? sql`${schema.post.postedAt} < ${lastPost.postedAt}::TIMESTAMP`
   //                      : sql`${schema.post.postedAt} <= ${lastPost.postedAt}::TIMESTAMP`;

   //                return await db
   //                   .select()
   //                   .from(post)
   //                   .where(filter)
   //                   .orderBy(desc(schema.post.postedAt))
   //                   .limit(input.limit);
   //             } catch (e) {
   //                console.log(e);
   //                return [];
   //             }
   //          }
   //          default:
   //             throw "unimplimented";
   //       }
   //    }),
});
