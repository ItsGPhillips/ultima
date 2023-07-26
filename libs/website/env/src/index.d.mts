/**
 * @type {typeof env1}
 */
export const env: typeof env1;
declare const env1: {
    NODE_ENV: "development" | "test" | "production";
    DATABASE_URL: string;
    CSRF_SECRET_KEY: string;
    CLOUDFLARE_R2_BUCKET_NAME: string;
    CLOUDFLARE_R2_ACCOUNT_ID: string;
    CLOUDFLARE_R2_ACCESS_KEY: string;
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: string;
    NEXT_PUBLIC_CLOUDFLARE_STORAGE_URL: string;
    NEXT_PUBLIC_CLOUDFLARE_STORAGE_DOMAIN: string;
};
export {};
