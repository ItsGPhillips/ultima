"use client";

import { cn } from "@website/utils";
import { AriaButton, Dialog, Spinner } from "@website/components/shared";
import { CreatePostState, useCreatePostState } from "./Provider";
import { createPostAction } from "@website/actions";
import { useTransition } from "react";
import superjson from "superjson";
import { motion, useAnimate } from "framer-motion";
import { mergeRefs } from "@react-aria/utils";
import { observer } from "mobx-react-lite";
import { action } from "mobx";
import { FileWithPath } from "react-dropzone";
import { z } from "zod";

const MULTI_PART_UPLOAD_CREATE_SCHEMA = z.object({
   id: z.string().nonempty(),
   key: z.string().nonempty(),
});

const MULTI_PART_UPLOAD_PART_SCHEMA = z.object({
   chunkSize: z.number(),
   maxRetries: z.number(),
   urls: z.string().nonempty().array(),
});

const MULTI_PART_UPLOAD_COMPLETE_SCHEMA = z.object({});

import { useQueryClient } from "@tanstack/react-query";

//TODO put this somewhere to reuse
const MotionAriaButton = motion(AriaButton);

// TODO: move to utils folder
function isString(value: string | undefined): value is string {
   return !!value;
}

const singlePartUpload = async (
   state: CreatePostState
): Promise<Array<string>> => {
   let uncheckedImages = await Promise.all(
      state.files.map(
         action(async (fileMeta) => {
            fileMeta.uploadProgress = 0;
            const { data } = await fetch(
               `/api/media/single.upload?content-type=${encodeURIComponent(
                  fileMeta.file.type
               )}`
            ).then((res) => res.json());
            try {
               fileMeta.uploadProgress = 0.5;
               await fetch(data.uploadUrl, {
                  method: "PUT",
                  body: fileMeta.file,
                  headers: {
                     "Content-Type": fileMeta.file.type,
                  },
               });
               fileMeta.uploadProgress = 1;
               return data.key as string;
            } catch (e) {
               console.error(e);
            }
         })
      )
   );
   return uncheckedImages.filter(isString);
};

const mulipartUpload = async (file: FileWithPath) => {
   const create = async () => {
      const url = new URL(
         "/api/media/multi.upload.create",
         window.location.origin
      );
      url.searchParams.set("type", file.type);

      return await fetch(url, {
         method: "GET",
      })
         .then((res) => res.json())
         .then((data) => MULTI_PART_UPLOAD_CREATE_SCHEMA.parse(data));
   };

   const upload = async (id: string, key: string, size: number) => {
      const url = new URL(
         "/api/media/multi.upload.part",
         window.location.origin
      );
      url.searchParams.set("id", id);
      url.searchParams.set("key", key);
      url.searchParams.set("size", String(size));

      const { chunkSize, maxRetries, urls } = await fetch(url, {
         method: "POST",
      })
         .then(async (res) => {
            console.log(Array.from(res.headers.entries()));
            const data = await res.json();
            console.log(data);
            return data;
         })
         .then((data) => MULTI_PART_UPLOAD_PART_SCHEMA.parse(data));

      const responses = await Promise.all(
         urls.map(async (url, idx) => {
            const byteOffset = idx * chunkSize;
            const bytes = file.slice(byteOffset, byteOffset + chunkSize);

            let response: Response | null = null;
            let retryCount = 0;
            let hasErrored: boolean;

            while (retryCount < maxRetries) {
               hasErrored = false;
               response = null;
               try {
                  response = await fetch(url, {
                     method: "PUT",
                     body: bytes,
                     headers: {
                        "Content-Type": file.type,
                     },
                  });

                  hasErrored = !response.ok;
               } catch (e) {
                  console.error(e);
                  // TODO (George): impliment some logging endpoint to track issues.
                  hasErrored = true;
               } finally {
                  if (hasErrored) {
                     await new Promise((res) => setTimeout(res, 1500));
                     retryCount++;
                     continue;
                  }
                  break;
               }
            }

            return response;
         })
      );

      return !responses.includes(null);
   };

   const completeUpload = async (id: string, key: string) => {
      const url = new URL(
         "/api/media/multi.upload.complete",
         window.location.origin
      );
      url.searchParams.set("id", id);
      url.searchParams.set("key", key);

      await fetch(url, {
         method: "POST",
      })
         .then((res) => res.json())
         .then((data) => MULTI_PART_UPLOAD_COMPLETE_SCHEMA.parse(data));
   };

   const abortUpload = async (id: string, key: string) => {};

   // =========================================================

   const { id, key } = await create();
   if (await upload(id, key, file.size)) {
      await completeUpload(id, key);
   } else {
      await abortUpload(id, key);
   }

   return key;
};

const SubmitPostButton = observer(() => {
   const [aref, animate] = useAnimate();
   const dialog = Dialog.useDialogState();
   const state = useCreatePostState();
   const [pending, transition] = useTransition();
   const client = useQueryClient();

   return (
      <MotionAriaButton
         ref={mergeRefs(aref)}
         className={cn(
            "relative h-10 w-32 select-none border-2 border-green-400 bg-green-400/20 px-2 py-1 hover:bg-green-400/25"
         )}
         onPress={async () => {
            const callback = action(async () => {
               try {
                  const images = await Promise.all(
                     state.files.map(async ({ file }) => {
                        return mulipartUpload(file);
                     })
                  );
                  await createPostAction({
                     handle: state.handle,
                     images,
                     body: superjson.serialize(state.editor.getJSON()),
                  });
                  await new Promise((res) => setTimeout(res, 1000));
               } catch (e) {
                  console.error(e);
               } finally {
                  dialog.isOpen = false;
                  client.refetchQueries({
                     queryKey: [{ page: state.handle }, "posts"],
                  });
                  return;
               }
            });

            if (state.validate()) {
               transition(callback);
            } else {
               animate(
                  aref.current,
                  {
                     filter: ["saturate(10%)", "saturate(100%)"],
                  },
                  {
                     ease: "easeIn",
                     duration: 0.3,
                  }
               );
               animate(
                  aref.current,
                  {
                     x: [-4, 4, -4, 0],
                  },
                  {
                     ease: "easeInOut",
                     duration: 0.2,
                  }
               );
            }
         }}
      >
         {pending ? <Spinner /> : "Create Post"}
      </MotionAriaButton>
   );
});

export const Controls = observer(() => {
   const state = useCreatePostState();
   return (
      <div className="mt-2 flex h-10 items-center gap-4">
         <div className="flex h-full items-center p-2 text-blue-300">
            {state.statusText.get()}
         </div>
         <div className="ml-auto flex flex-nowrap items-center gap-4">
            <SubmitPostButton />
            <Dialog.Close asChild>
               <MotionAriaButton className="h-10 w-24 select-none border-2 border-white/40 bg-white/20 py-1 hover:bg-white/25">
                  Close
               </MotionAriaButton>
            </Dialog.Close>
         </div>
      </div>
   );
});
