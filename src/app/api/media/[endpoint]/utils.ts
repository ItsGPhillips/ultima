import { cuid } from "~/utils/cuid";
import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";
import { NextRequest } from "next/server";
import { ZodSchema, z } from "zod";

export const MIMETypeMap: Record<string, { prefix: string; ext: string }> = {
   "application/json": { prefix: "data", ext: "json" },
   "text/plain": { prefix: "text", ext: "txt" },
   "text/csv": { prefix: "text", ext: "csv" },
   "text/html": { prefix: "text", ext: "html" },
   "image/jpeg": { prefix: "image", ext: "jpeg" },
   "image/jpg": { prefix: "image", ext: "jpeg" },
   "image/png": { prefix: "image", ext: "png" },
   "image/webp": { prefix: "image", ext: "webp" },
   "image/svg": { prefix: "image", ext: "svg" },
   "image/xml": { prefix: "image", ext: "xml" },
   "video/mp4": { prefix: "video", ext: "mp4" },
   "video/webm": { prefix: "video", ext: "webm" },
} as const;

type INTERNAL_Errors = Record<
   string | number | symbol,
   Array<string> | undefined
>;

export class MediaRouteError extends Error {
   public statusCode: number;
   public errors: INTERNAL_Errors;
   constructor(message: string, errors: INTERNAL_Errors, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
   }
}

export const createKey = (contentType: string): string => {
   const meta = MIMETypeMap[contentType];
   if (meta === undefined) {
      throw new MediaRouteError("Invalid MIME type search param", {}, 400);
   }
   return `${meta.prefix}-${cuid()}.${meta.ext}`;
};

const convertSearchParams = (req: NextRequest) => {
   const url = new URL(req.url);
   const searchParams: Record<string, any> = {};
   for (const [key, value] of url.searchParams.entries()) {
      searchParams[key] = value;
   }
   return searchParams;
};

export const validateSearchParams = <T extends ZodSchema>(
   schema: T,
   req: NextRequest
): z.infer<T> => {
   const result = schema.safeParse(convertSearchParams(req));
   if (!result.success) {
      throw new MediaRouteError(
         "Invalid search params",
         result.error.flatten().fieldErrors,
         400
      );
   }
   return result.data;
};

// ==============================================================================

const globalForS3 = globalThis as unknown as { s3: S3Client };
export const s3 =
   globalForS3.s3 ||
   new S3Client({
      region: "auto",
      endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
         accessKeyId: `${env.CLOUDFLARE_R2_ACCESS_KEY}`,
         secretAccessKey: `${env.CLOUDFLARE_R2_SECRET_ACCESS_KEY}`,
      },
   });

if (env.NODE_ENV !== "production") globalForS3.s3 = s3;
