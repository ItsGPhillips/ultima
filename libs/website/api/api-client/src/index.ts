"use client";

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { getBaseUrl } from "@website/utils"
import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '@website/api/server';

export const trpc = createTRPCReact<AppRouter>();

export const api = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
} as any);

export { type AppRouter };
