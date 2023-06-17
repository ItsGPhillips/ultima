import { z } from "zod";
import { createTRPCRouter, procedure } from "../trpc";
import { db } from "~/server/database";
import { and, eq } from "drizzle-orm";
import { post, profile, subscription } from "~/server/database/schema/user";
import { TRPCError } from "@trpc/server";
import { POST_TABLE_SCHEMA } from "~/server/database/zod";
import { USER_HANDLE } from "../middleware";
import { cuid } from "~/utils/cuid";

namespace utils {
   export const getPageSubscription = async (
      pageId: string,
      profileHandle: string
   ) => {
      const data = await db.query.subscription.findFirst({
         columns: {
            profileHandle: false,
         },
         where: and(
            eq(subscription.groupId, pageId),
            eq(subscription.profileHandle, profileHandle)
         ),
      });
      return {
         subscription: data ?? null,
      };
   };
}

export const pagesRouter = createTRPCRouter({
   //==============================================================
   getPosts: procedure
      .input(
         z.object({
            sort: z.union([
               z.object({
                  method: z.literal("NEWEST"),
               }),
               z.object({
                  method: z.literal("TRENDING"),
               }),
               z.object({
                  method: z.literal("UPVOTES"),
                  range: z.union([
                     z.literal("D"),
                     z.literal("W"),
                     z.literal("M"),
                     z.literal("Y"),
                     z.literal("A"),
                  ]),
               }),
            ]),
            pageId: z.string(),
            cursor: z.number(),
         })
      )
      .query(async ({ctx, input}) => {

         db.select().from(post).orderBy(post.postedAt).limit(0)
      }),
   //==============================================================
   addPost: procedure
      .use(USER_HANDLE)
      .input(
         POST_TABLE_SCHEMA.insert.omit({
            profileHandle: true,
            id: true,
         })
      )
      .mutation(async ({ ctx, input }) => {
         await db.insert(post).values({
            ...input,
            id: cuid(),
            profileHandle: ctx.profileHandle,
         });
      }),
   //==============================================================
   getSubscription: procedure
      .use(USER_HANDLE)
      .input(
         z.object({
            pageId: z.string(),
         })
      )
      .query(({ ctx, input }) => {
         return utils.getPageSubscription(input.pageId, ctx.profileHandle);
      }),
   //==============================================================
   getIsSubscribed: procedure
      .use(USER_HANDLE)
      .input(
         z.object({
            pageId: z.string(),
         })
      )
      .query(async ({ ctx, input }) => {
         const data = await utils.getPageSubscription(
            input.pageId,
            ctx.profileHandle
         );
         return data.subscription !== null;
      }),
   //==============================================================
   toggleSubscription: procedure
      .use(USER_HANDLE)
      .input(
         z.object({
            pageId: z.string(),
         })
      )
      .mutation(async ({ ctx, input }) => {
         const s = await utils.getPageSubscription(
            input.pageId,
            ctx.profileHandle
         );

         if (s.subscription) {
            await db
               .delete(subscription)
               .where(
                  and(
                     eq(subscription.groupId, input.pageId),
                     eq(subscription.profileHandle, ctx.profileHandle)
                  )
               );
            return;
         }

         await db.insert(subscription).values({
            groupId: input.pageId,
            profileHandle: ctx.profileHandle,
         });
      }),
});
