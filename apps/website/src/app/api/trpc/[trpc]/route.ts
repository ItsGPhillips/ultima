import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createTRPCContext } from "@website/api/server";
import { auth } from "@website/lucia";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const handler = (request: NextRequest) => {
   const authRequest = auth.handleRequest({
      request,
      cookies,
   });
   return fetchRequestHandler({
      endpoint: `/api/trpc`,
      req: request,
      router: appRouter,
      createContext: () => createTRPCContext({ authRequest }),
      batching: {
         enabled: true,
      },
   });
};

export { handler as GET, handler as POST };
