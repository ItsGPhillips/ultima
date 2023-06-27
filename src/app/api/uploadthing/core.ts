import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import { auth } from "~/server/lucia";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
   // Define as many FileRoutes as you like, each with a unique routeSlug
   imageUploader: f({ image: { maxFileSize: "4MB" } })
      .input(z.object({}))
      // Set permissions and file types for this FileRoute
      .middleware(async ({ req }) => {
         const authRequest = auth.handleRequest({ request: req, cookies });
         const result = await authRequest.validateUser();

         if (!result.user) {
            throw new Error("Unauthorized");
         }
         // Whatever is returned here is accessible in onUploadComplete as `metadata`
         return { userId: result.user.id };
      })
      .onUploadComplete(async ({ metadata, file }) => {
         // This code RUNS ON YOUR SERVER after upload
         console.log("Upload complete for userId:", metadata.userId);

         console.log("file url", file.url);
      }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
