"use client";

import { ComponentProps, PropsWithChildren, forwardRef } from "react";
import { AriaButton, Button } from "~/components/shared/Button";
import { cn } from "~/utils/cn";
import * as Dialog from "~/components/shared/Dialog";
import { mergeRefs } from "@react-aria/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useBoolean } from "usehooks-ts";

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
   // onPress={() => {
   //    transition(async () => {
   //       await createPost({
   //          handle: props.handle,
   //          title: faker.lorem.sentence(),
   //          body: faker.lorem.paragraphs(),
   //       });
   //    });
   // }}

   const isOpen = useBoolean(false);

   return (
      <Dialog.Root
         open={isOpen.value}
         onOpenChange={(value) => {
            isOpen.setValue(value);
         }}
         modal
      >
         <Dialog.Trigger asChild>
            <Button className="h-9 w-32 border-2 border-orange-400 bg-orange-400/50">
               Create Post
            </Button>
         </Dialog.Trigger>
         <AnimatePresence>
            {isOpen.value && (
               <Dialog.Portal forceMount>
                  <Dialog.Overlay forceMount asChild>
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeIn" }}
                        className="fixed inset-0 z-[1000] bg-black/50"
                     />
                  </Dialog.Overlay>
                  <CreatePostDialogContent>
                     {props.children}
                  </CreatePostDialogContent>
               </Dialog.Portal>
            )}
         </AnimatePresence>
      </Dialog.Root>
   );
};

export const CreatePostDialogContent = forwardRef<
   HTMLDivElement,
   ComponentProps<typeof Dialog.Content>
>((props, fref) => {
   return (
      <Dialog.Content forceMount asChild>
         <motion.div
            ref={mergeRefs(fref)}
            initial={{
               opacity: 0,
               top: "48%",
               left: "50%",
               transform: "translate(-50%, -50%)",
            }}
            animate={{
               opacity: 1,
               top: "50%",
               left: "50%",
               transform: "translate(-50%, -50%)",
               transition: { duration: 0.2, ease: "easeOut" },
            }}
            exit={{
               opacity: 0,
               top: "48%",
               left: "50%",
               transform: "translate(-50%, -50%)",
               transition: { duration: 0.2, ease: "backIn" },
            }}
            style={{
               transformBox: "border-box",
               maxWidth: "min(100ch, calc(100% - 0.5rem))",
            }}
            className={cn(
               "fixed z-[1000] w-full overflow-hidden rounded-xl border-[2px] border-zinc-600 shadow-2xl shadow-black outline-none"
            )}
            {...(props as any)}
         >
            {props.children}
         </motion.div>
      </Dialog.Content>
   );
});
