import { createTRPCRouter } from "~/server/api/trpc";
import { pagesRouter } from "./routers/page";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
   pages: pagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createTRPCCaller = appRouter.createCaller;
