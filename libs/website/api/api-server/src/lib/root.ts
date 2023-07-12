import { router } from "./trpc";
import { authRouter } from "./routes/auth/auth";
import { postsRouter } from "./routes/post/post";

export const appRouter = router({
   auth: authRouter,
   post: postsRouter,
});

export type AppRouter = typeof appRouter;
