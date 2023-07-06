import { handleAuth } from "../middleware";
import { router, publicProcedure } from "../trpc";

export const greetingRouter = router({
   getGreeting: publicProcedure.use(handleAuth).query(async ({ ctx }) => {
      return { message: `Hello, ${ctx.auth.userId}` };
   }),
});
