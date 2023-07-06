import { router } from "./trpc";
import { authRouter } from "./routes/auth/auth";

export const appRouter = router({
   auth: authRouter,
});

export type AppRouter = typeof appRouter;
