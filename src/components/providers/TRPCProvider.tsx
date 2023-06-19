"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { trpc } from "~/utils/trpc";

function getBaseUrl() {
   if (typeof window !== "undefined")
      // browser should use relative path
      return "";
   if (process.env.VERCEL_URL)
      // reference for vercel.com
      return `https://${process.env.VERCEL_URL}`;
   if (process.env.RENDER_INTERNAL_HOSTNAME)
      // reference for render.com
      return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
   // assume localhost
   return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function TRPCClientProvider(props: { children: React.ReactNode }) {
   const [queryClient] = useState(() => new QueryClient());
   const [trpcClient] = useState(() =>
      trpc.createClient({
         links: [
            loggerLink({
               enabled: (opts) =>
                  process.env.NODE_ENV === "development" ||
                  (opts.direction === "down" && opts.result instanceof Error),
            }),
            httpBatchLink({
               url: `${getBaseUrl()}/api/trpc`,
            }),
         ],
         transformer: superjson,
      })
   );

   return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
         <QueryClientProvider client={queryClient}>
            {props.children}
            <ReactQueryDevtools />
         </QueryClientProvider>
      </trpc.Provider>
   );
}