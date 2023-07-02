"use client";

import { RichTextEditor } from "../RichTextEditor";
import { Controls as EditorControls } from "../RichTextEditor/Controls";
import { CreatePostStateProvider, useCreatePostState } from "./Provider";
import { Dialog } from "~/components/shared/Dialog";
import { Controls } from "./Controls";
import { UploadFilesPanel } from "./UploadPanel";
import { motion } from "framer-motion";

export const CreatePostDialog = (props: { handle: string }) => {
   return (
      <CreatePostStateProvider handle={props.handle}>
         <motion.div
            layoutRoot
            className="flex max-h-[75vh] w-full flex-col gap-2 bg-zinc-900 p-6 text-white"
         >
            <Dialog.Title className="ml-2 text-xl font-bold text-white/80 antialiased">
               Create Post
            </Dialog.Title>
            <Editor />
            <UploadFilesPanel />
            <Errors />
            <Controls />
         </motion.div>
      </CreatePostStateProvider>
   );
};

const Errors = () => {
   const state = useCreatePostState();

   return Array.from(state.errors.values()).map((error) => {
      return (
         <div key={error} className="w-full p-1 text-red-400">
            {error}
         </div>
      );
   });
};

const Editor = () => {
   return (
      <>
         <EditorControls />
         <RichTextEditor className="min-h-[20ch] w-full rounded-xl bg-black/20 p-4 subpixel-antialiased caret-white" />
      </>
   );
};
