import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export default createNextApiHandler({
   router: appRouter,
   batching: {
      enabled: true,
   },
   createContext(opts) {
      return createTRPCContext(opts);
   },
});
