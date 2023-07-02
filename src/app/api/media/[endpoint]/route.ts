import { NextRequest, NextResponse } from "next/server";
import { ZodSchema, z } from "zod";
import { createSingleUploadSignedUrl } from "./single.upload";
import { MediaRouteError, s3, validateSearchParams } from "./utils";
import { createMultiPartUpload } from "./multi.upload.create";
import { getMultiPartUploadUrls } from "./multi.upload.part";
import { completeMultiPartUpload } from "./multi.upload.complete";
import { ListPartsCommand } from "@aws-sdk/client-s3";
import { env } from "~/env.mjs";
import { Log } from "~/utils/log";

type Context = { params: { endpoint: string }; searchParams: any };
type MediaApiRoute = (req: NextRequest, ctx: Context) => Promise<NextResponse>;

const GET_ENDPOINT_SCHEMA = z.union([
   z.literal("single.upload"),
   z.literal("multi.upload.create"),
   z.never(),
]);

const validateEndpoint = <T extends ZodSchema>(
   schema: T,
   endpoint: string
): z.infer<T> => {
   const result = schema.safeParse(endpoint);
   if (!result.success) {
      throw new MediaRouteError("Endpoint not found", {}, 404);
   }
   return result.data;
};

export const GET: MediaApiRoute = async (req, { params, searchParams }) => {
   try {
      const endpoint = validateEndpoint(GET_ENDPOINT_SCHEMA, params.endpoint);

      switch (endpoint) {
         case "single.upload": {
            const data = await createSingleUploadSignedUrl(req);
            return NextResponse.json({ data });
         }
         case "multi.upload.create": {
            return NextResponse.json(await createMultiPartUpload(req));
         }
         default: {
            throw "unreachable";
         }
      }
   } catch (error) {
      if (error instanceof MediaRouteError) {
         return NextResponse.json(
            { message: error.message, reasons: error.errors },
            { status: error.statusCode }
         );
      }
      throw error;
   }
};

const POST_ENDPOINT_SCHEMA = z.union([
   z.literal("multi.upload.part"),
   z.literal("multi.upload.complete"),
   z.never(),
]);

export const POST: MediaApiRoute = async (req, { params }) => {
   try {
      const endpoint = validateEndpoint(POST_ENDPOINT_SCHEMA, params.endpoint);

      switch (endpoint) {
         case "multi.upload.part": {
            return NextResponse.json(await getMultiPartUploadUrls(req));
         }
         case "multi.upload.complete": {
            await completeMultiPartUpload(req);
            return NextResponse.json({});
         }
         default: {
            throw "unreachable";
         }
      }
   } catch (error) {
      if (error instanceof MediaRouteError) {
         return NextResponse.json(
            { message: error.message, reasons: error.errors },
            { status: error.statusCode }
         );
      }
      throw error;
   }
};
