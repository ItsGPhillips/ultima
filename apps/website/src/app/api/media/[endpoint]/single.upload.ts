import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest } from "next/server";
import { env } from "process";
import { createKey, s3, validateSearchParams } from "./utils";
import { z } from "zod";

const PARAMS_SCHEMA = z.object({
   type: z.string().nonempty(),
});

export const createSingleUploadSignedUrl = async (req: NextRequest) => {
   const { type } = validateSearchParams(PARAMS_SCHEMA, req);
   const key = createKey(type);

   const putObjectCommand = new PutObjectCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      ContentType: type,
   });

   const uploadUrl = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 60 * 60 * 7,
   });

   return { uploadUrl, key };
};
