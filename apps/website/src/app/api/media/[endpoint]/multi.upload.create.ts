import { CreateMultipartUploadCommand } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";
import { env } from "@website/env";
import { MediaRouteError, createKey, s3, validateSearchParams } from "./utils";
import { z } from "zod";
import { MULTI_PART_UPLOAD_CREATE_SCHEMA } from "../schema";

const PARAMS_SCHEMA = z.object({
   type: z.string().nonempty(),
});

export const createMultiPartUpload = async (
   req: NextRequest
): Promise<z.infer<typeof MULTI_PART_UPLOAD_CREATE_SCHEMA>> => {
   const { type } = validateSearchParams(PARAMS_SCHEMA, req);
   const key = createKey(type);

   const mpuCommand = new CreateMultipartUploadCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      ContentType: type,
   });

   const { UploadId } = await s3.send(mpuCommand);
   if (!UploadId) {
      throw new MediaRouteError("Upload Id was undefined", {}, 500);
   }

   return { id: UploadId, key };
};
