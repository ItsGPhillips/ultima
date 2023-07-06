import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { appRouter, AppRouter } from "./lib/root";

/**
 * The `appRouter` export is used to configure the Next.js tRPC API endpoint, and the `AppRouter` type is used by the Next.js app to create the type-safe tRPC client.
 * @example
 */
export { appRouter, type AppRouter };

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;

const getBaseUrl = () => {
   if (typeof window !== "undefined") return ""; // browser should use relative url
   if (process.env["VERCEL_URL"]) return `https://${process.env["VERCEL_URL"]}`; // SSR should use vercel url
   return `http://localhost:${process.env["PORT"] ?? 4200}`; // dev SSR should use localhost
};

export const api = createTRPCProxyClient<AppRouter>({
   links: [httpBatchLink({ url: `${getBaseUrl()}/trpc` })],
} as any);
