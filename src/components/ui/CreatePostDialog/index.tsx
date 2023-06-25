"use client";

import { RichTextEditor } from "../RichTextEditor";
import { CreatePostDialogStateProvider, useCreatePostState } from "./Provider";
import * as Dialog from "~/components/shared/Dialog";
import { TitleInput } from "./Title";
import { Controls } from "./Controls";

export const CreatePostDialog = (props: { handle: string }) => {
   return (
      <CreatePostDialogStateProvider handle={props.handle}>
         <div className="flex max-h-[75vh] w-full flex-col bg-zinc-900 p-4 text-white">
            <Dialog.Title className="p-4 text-xl font-bold text-white/80 antialiased">
               Create Post
            </Dialog.Title>
            <TitleInput />
            <Editor />
            <Controls />
            <Errors />
         </div>
      </CreatePostDialogStateProvider>
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
   return <RichTextEditor editor={state.body} />;
};
