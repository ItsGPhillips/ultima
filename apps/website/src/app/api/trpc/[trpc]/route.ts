import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@website/api/server";

const handler = (req: Request) => {
   return fetchRequestHandler({
      endpoint: `/api/trpc`,
      req,
      router: appRouter,
      createContext: () => ({}),
      batching: {
         enabled: true,
      },
   });
};

export { handler as GET, handler as POST };
