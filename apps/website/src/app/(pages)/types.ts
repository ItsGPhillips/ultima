import { z } from 'zod';
export const LAYOUT_CTX_SCHEMA = z
  .object({
    children: z.custom<React.ReactNode>(),
    pageinfo: z.custom<React.ReactNode>(),
    sidebar: z.custom<React.ReactNode>(),
    params: z.object({
      slug: z.string(),
    }),
  })
  .brand();

export type LayoutContext = z.infer<typeof LAYOUT_CTX_SCHEMA>;
