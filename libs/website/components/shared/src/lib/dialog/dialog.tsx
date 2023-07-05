"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ComponentPropsWithRef, forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@website/utils";
import {
   DialogStateProvider,
   useDialogState as _useDialogState,
} from "./Provider";

// TODO: custom data

const DialogContent = forwardRef<HTMLDivElement, ComponentPropsWithRef<"div">>(
   (props, fref) => {
      const state = _useDialogState();
      return (
         <AnimatePresence>
            {state.isOpen && (
               <DialogPrimitive.Portal forceMount>
                  <DialogPrimitive.Overlay forceMount asChild>
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeIn" }}
                        className="fixed inset-0 z-[1000] bg-black/50"
                     />
                  </DialogPrimitive.Overlay>
                  <DialogPrimitive.Content forceMount asChild>
                     <motion.div
                        {...props}
                        ref={fref}
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
                           width: "var(--feed-width)",
                           // maxWidth: "min(100ch, calc(100% - 0.5rem))",
                        }}
                        className={cn(
                           "fixed z-[1000] w-full overflow-hidden rounded-xl border-[2px] border-zinc-600 shadow-2xl shadow-black outline-none"
                        )}
                        {...(props as any)}
                     >
                        {props.children}
                     </motion.div>
                  </DialogPrimitive.Content>
               </DialogPrimitive.Portal>
            )}
         </AnimatePresence>
      );
   }
);

export namespace Dialog {
   export const useDialogState = _useDialogState;
   export const Content = DialogContent;
   export const Provider = DialogStateProvider;
   export const Trigger = DialogPrimitive.Trigger;
   export const Close = DialogPrimitive.Close;
   export const Description = DialogPrimitive.Description;
   export const Title = DialogPrimitive.Title;
}
