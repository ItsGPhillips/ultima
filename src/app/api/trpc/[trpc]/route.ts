import { getAuth } from "@clerk/nextjs/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";
import { env } from "~/env.mjs";
import { AppRouter, appRouter } from "~/server/api/root";

// this is the server RPC API handler

const handler = (request: NextRequest) => {
   return fetchRequestHandler<AppRouter>({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      batching: {
         enabled: true,
      },
      createContext: () => {
         return {
            auth: getAuth(request, { secretKey: env.CLERK_SECRET_KEY }),
         };
      },
   });
};

export const GET = handler;
export const POST = handler;
