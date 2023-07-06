"use client";

import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import { getBaseUrl } from "@website/utils";
import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@website/api/server";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

export const api = createTRPCProxyClient<AppRouter>({
   transformer: superjson,
   links: [
      loggerLink({
         enabled: (opts) =>
            process.env["NODE_ENV"] === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
      }),
      httpBatchLink({ url: `${getBaseUrl()}/api/trpc` }),
   ],
});

export { type AppRouter };
