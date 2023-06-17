import { TRPCError } from "@trpc/server";
import { middleware } from "./trpc";
import { db } from "../database";
import { eq } from "drizzle-orm";
import { profile } from "../database/schema/user";

export const AUTHENTICATED = middleware(async ({ ctx, next }) => {
   if (!ctx.auth.userId || !ctx.auth.sessionId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
   }
   return next({
      ctx: {
         auth: {
            userId: ctx.auth.userId,
            sessionId: ctx.auth.sessionId,
         },
      },
   });
});

export const USER_HANDLE = AUTHENTICATED.unstable_pipe(
   async ({ ctx, next }) => {
      const data = await db.query.profile.findFirst({
         columns: {
            handle: true,
         },
         where: eq(profile.clerkId, ctx.auth.userId),
      });
      if (!data) {
         throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: "no profile handle found for authenticated user id",
         });
      }
      return next({
         ctx: {
            profileHandle: data.handle,
         },
      });
   }
);
