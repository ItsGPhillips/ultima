import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URL: z.string(),
    CSRF_SECRET_KEY: z.string(),
    //-------------------------------------------------------
    CLOUDFLARE_R2_BUCKET_NAME: z.string(),
    CLOUDFLARE_R2_ACCOUNT_ID: z.string(),
    CLOUDFLARE_R2_ACCESS_KEY: z.string(),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    NEXT_PUBLIC_CLOUDFLARE_STORAGE_URL: z.string().url(),
    NEXT_PUBLIC_CLOUDFLARE_STORAGE_DOMAIN: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env['NODE_ENV'],
    DATABASE_URL: process.env['DATABASE_URL'],
    CSRF_SECRET_KEY: process.env['CSRF_SECRET_KEY'],

    CLOUDFLARE_R2_ACCOUNT_ID: process.env['CLOUDFLARE_R2_ACCOUNT_ID'],
    CLOUDFLARE_R2_ACCESS_KEY: process.env['CLOUDFLARE_R2_ACCESS_KEY'],
    CLOUDFLARE_R2_SECRET_ACCESS_KEY:
      process.env['CLOUDFLARE_R2_SECRET_ACCESS_KEY'],
    CLOUDFLARE_R2_BUCKET_NAME: process.env['CLOUDFLARE_R2_BUCKET_NAME'],
    NEXT_PUBLIC_CLOUDFLARE_STORAGE_URL:
      process.env['NEXT_PUBLIC_CLOUDFLARE_STORAGE_URL'],
    NEXT_PUBLIC_CLOUDFLARE_STORAGE_DOMAIN:
      process.env['NEXT_PUBLIC_CLOUDFLARE_STORAGE_DOMAIN'],
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env['SKIP_ENV_VALIDATION'],
});
