import { authenicated } from "../../middleware";
import { router, publicProcedure } from "../../trpc";
import { auth } from "@website/lucia";

import { SIGN_IN_SCHEMA, checkSession, getKey } from "./signin.utils";
import { CREATE_ACCOUNT_SCHEMA, createUserImpl } from "./create.utils";

export const authRouter = router({
   create: publicProcedure
      .input(CREATE_ACCOUNT_SCHEMA)
      .mutation(async ({ input }) => {
         await createUserImpl(input);
      }),

   signIn: publicProcedure
      .input(SIGN_IN_SCHEMA)
      .mutation(async ({ input, ctx }) => {
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
      }),

   signOut: publicProcedure.use(authenicated).mutation(async ({ ctx }) => {
      await auth.invalidateSession(ctx.auth.sessionId);
      auth.deleteDeadUserSessions(ctx.auth.userId);
      ctx.authRequest.setSession(null); // delete session cookie
   }),
});
