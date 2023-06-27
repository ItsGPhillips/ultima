"use client";

import { RichTextEditor } from "../RichTextEditor";
import { Controls as EditorControls } from "../RichTextEditor/Controls";
import { CreatePostStateProvider, useCreatePostState } from "./Provider";
import { Dialog } from "~/components/shared/Dialog";
import { TitleInput } from "./Title";
import { Controls } from "./Controls";
import { VisuallyHidden } from "react-aria";
import { BsImages } from "react-icons/bs";
import { AriaButton } from "~/components/shared/Button";

export const CreatePostDialog = (props: { handle: string }) => {
   return (
      <CreatePostStateProvider handle={props.handle}>
         <div className="flex max-h-[75vh] w-full flex-col gap-2 bg-zinc-900 p-6 text-white">
            <VisuallyHidden>
               <Dialog.Title className="text-xl font-bold text-white/80 antialiased">
                  Create Post
               </Dialog.Title>
            </VisuallyHidden>
            <TitleInput />
            <Editor />
            <Errors />
            <div className="flex">
               <AriaButton className="group flex gap-2 p-2 px-4 text-sm font-light text-white/60 hover:bg-white/20 hover:text-white">
                  <BsImages className="h-6 w-6 fill-white/60 group-hover:fill-white" />
                  <span>Upload Images</span>
               </AriaButton>
            </div>

            <Controls />
         </div>
      </CreatePostStateProvider>
   );
};

const Errors = () => {
   const state = useCreatePostState();
   return state.errors.map((error) => {
      return (
         <div key={error} className="w-full p-1 text-red-400">
            ERROR: {error}
         </div>
      );
   });
};

const Editor = () => {
   const state = useCreatePostState();
   return (
      <>
         {!!state.body && <EditorControls editor={state.body} />}
         <RichTextEditor
            editor={state.body}
            className="w-full rounded-xl bg-black/20 p-4 caret-white"
         />
      </>
   );
};
