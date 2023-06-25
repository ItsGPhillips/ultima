"use client";

import { AriaButton } from "~/components/shared/Button";
import * as Dialog from "../../shared/Dialog";
import { useCreatePostState } from "./Provider";
import { createPostAction } from "~/server/actions/post";
import { useTransition } from "react";
import superjson from "superjson";

export const Controls = () => {
   const state = useCreatePostState();
   const [pending, transition] = useTransition();
   return (
      <div className="flex h-16 items-center justify-end gap-2">
         <AriaButton
            isDisabled={pending}
            onPress={() => {
               transition(async () => {
                  if (state.validate()) {
                     await createPostAction({
                        handle: state.handle,
                        title: state.title,
                        body: superjson.serialize(state.body!.getJSON()),
                     });
                  }
               });
            }}
            className="border-2 border-green-400 bg-green-500/20 px-4 py-2"
         >
            {pending ? "Loading" : "Create Post"}
         </AriaButton>
         <Dialog.Close>Close</Dialog.Close>
      </div>
   );
};
