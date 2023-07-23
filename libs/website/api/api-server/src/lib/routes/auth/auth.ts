import { authenicated } from "../../middleware";
import { router, procedure } from "../../trpc";
import { auth } from "@website/lucia";

import { SIGN_IN_SCHEMA, checkSession, getKey } from "./signin.utils";
import { CREATE_ACCOUNT_SCHEMA, createUserImpl } from "./create.utils";
import { Log } from "@website/utils";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
   create: procedure
      .input(CREATE_ACCOUNT_SCHEMA)
      .mutation(async ({ input }) => {
         // TODO email validation link
         await createUserImpl(input);
      }),

   signIn: procedure
      .input(SIGN_IN_SCHEMA)
      .mutation(async ({ input, ctx }) => {
         try {
            // --- Ensure there isn't already and active session.
            const checkSessionResult = await checkSession(ctx.authRequest);
            if (!checkSessionResult.success) {
               throw checkSessionResult.error;
            }
            // --- Get the auth.key associated with the provided credentials
            const getKeyResult = await getKey(input);
            if (!getKeyResult.success) {
               throw getKeyResult.error;
            }
            // --- Create a session for the user associated with the key.
            const key = getKeyResult.key;
            const session = await auth.createSession(key.userId);
            // --- Write the session into the cookies.
            ctx.authRequest.setSession(session);
         } catch (e: any) {
            let message = "";
            if ("help" in e) {
               message = e.help as string;
            }
            throw new TRPCError({
               code: "UNAUTHORIZED",
               message,
            });
         }
      }),

   signOut: procedure.use(authenicated).mutation(async ({ ctx }) => {
      Log.info("signOut");

      await auth.invalidateSession(ctx.auth.sessionId);
      auth.deleteDeadUserSessions(ctx.auth.userId);
      ctx.authRequest.setSession(null);
   }),
   checkEmail: procedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ ctx, input }) => {
         try {
            const key = await auth.getKey("email", input.email);
            Log.debug(key);
         } catch (e) {
            if (e instanceof Error) {
               Log.error(e.message, "Error");
            }
         }
      }),
});
