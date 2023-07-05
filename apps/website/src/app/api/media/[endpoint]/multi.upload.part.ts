import { UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest } from "next/server";
import { env } from "@website/env";
import { z } from "zod";
import { s3, validateSearchParams } from "./utils";
import { MULTI_PART_UPLOAD_PART_SCHEMA } from "../schema";

const PARAMS_SCHEMA = z.object({
   id: z.string().nonempty(),
   key: z.string().nonempty(),
   size: z.coerce.number(),
});

export const getMultiPartUploadUrls = async (
   req: NextRequest
): Promise<z.infer<typeof MULTI_PART_UPLOAD_PART_SCHEMA>> => {
   const { id, key, size } = validateSearchParams(PARAMS_SCHEMA, req);

   // TODO (George): use some database value or heuristic to determine these values.
   const CHUNK_SIZE_BYTES = 5.243e6; // 5 MiB s3 limit
   const MAX_RETRIES = 3;

   const chunks = Math.ceil(size / CHUNK_SIZE_BYTES);

   const promises = [];
   for (let idx = 0; idx < chunks; idx++) {
      promises.push(
         getSignedUrl(
            s3,
            new UploadPartCommand({
               Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
               Key: key,
               UploadId: id,
               PartNumber: idx + 1,
            }),
            {
               // TODO (George): is this the best expires time??
               expiresIn: 7200, // 2 hours
            }
         )
      );
   }
   const urls = await Promise.all(promises);
   return { chunkSize: CHUNK_SIZE_BYTES, urls, maxRetries: MAX_RETRIES };
};
