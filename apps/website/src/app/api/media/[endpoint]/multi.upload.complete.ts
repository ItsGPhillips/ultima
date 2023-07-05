import {
   CompleteMultipartUploadCommand,
   ListPartsCommand,
} from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";
import { env } from "@website/env";
import { s3, validateSearchParams } from "./utils";
import { z } from "zod";
import { MULTI_PART_UPLOAD_COMPLETE_SCHEMA } from "../schema";
import { Log } from "@website/utils";

const PARAMS_SCHEMA = z.object({
   id: z.string().nonempty(),
   key: z.string().nonempty(),
});

export const completeMultiPartUpload = async (
   req: NextRequest
): Promise<z.infer<typeof MULTI_PART_UPLOAD_COMPLETE_SCHEMA>> => {
   const { id, key } = validateSearchParams(PARAMS_SCHEMA, req);

   const partsCommand = new ListPartsCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      UploadId: id,
   });

   const { Parts } = await s3.send(partsCommand);

   const mpuCommand = new CompleteMultipartUploadCommand({
      MultipartUpload: { Parts },
      Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      UploadId: id,
   });
   try {
      await s3.send(mpuCommand);
   } catch (e) {
      Log.error(e, "multi.upload.complete");
   }
   return {};
};
