import { generateReactHelpers } from "@uploadthing/react/hooks";
import type { UltimaUploadThingFileRouter } from "~/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
   generateReactHelpers<UltimaUploadThingFileRouter>();
