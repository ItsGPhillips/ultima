"use client";

import { PropsWithChildren } from "react";
import { Button } from "~/components/ui/shared/Button";
import { AriaButton } from "~/components/ui/shared/Button/aria";
import { cn } from "~/utils/cn";
import { Dialog } from "~/components/shared/Dialog";

export type NewPostButtonProps = PropsWithChildren<{
   handle: string;
}>;

const DisabledPostButton = () => {
   return (
      <AriaButton
         className={cn(
            "h-8 w-32 border-2 border-orange-400 bg-orange-400/50 grayscale"
         )}
         isDisabled
      >
         Create Post
      </AriaButton>
   );
};

export const CreatePostButton = (props: NewPostButtonProps) => {
   if (props.handle === undefined) {
      return <DisabledPostButton />;
   }
   return (
      <Dialog.Provider modal>
         <Dialog.Trigger asChild>
            <Button className="h-9 w-32 border-2 border-orange-400 bg-orange-400/50">
               Create Post
            </Button>
         </Dialog.Trigger>
         <Dialog.Content>{props.children}</Dialog.Content>
      </Dialog.Provider>
   );
};
