import { TRPCError } from "@trpc/server";
import { trpc } from "./trpc";
import { Log } from "@website/utils";

export const handleAuth = trpc.middleware(async ({ ctx, next }) => {
   const validateResponse = await ctx.authRequest.validate();

   Log.info(ctx.authRequest.storedSessionId)
   
   return next({
      ctx: {
         auth: {
            ...validateResponse,
         },
      },
   });
});

export const authenicated = handleAuth.unstable_pipe(async ({ ctx, next }) => {
   Log.debug(ctx.auth)
   if (!ctx.auth.userId || !ctx.auth.sessionId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
   }
   return next({
      ctx: {
         auth: ctx.auth as Required<typeof ctx.auth>
      },
   });
});