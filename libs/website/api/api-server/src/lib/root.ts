import { router } from "./trpc";
import { authRouter } from "./routes/auth/auth";
import { postsRouter } from "./routes/post/post";
import { profileRouter } from "./routes/profile/profile";

export const appRouter = router({
   auth: authRouter,
   post: postsRouter,
   profile: profileRouter,
});

export type AppRouter = typeof appRouter;
