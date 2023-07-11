"use client";

import { useButton } from "@react-aria/button";
import { Dialog } from "@website/components/shared";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import { AuthEvents } from "../..";
import { prepareState } from "../input/state";
import { z } from "zod";
import { Input } from "../input/input";

export const SignInDialog = observer(() => {
   const linkRef = useRef<HTMLSpanElement>(null);
   const { buttonProps } = useButton(
      {
         onPress() {
            window.dispatchEvent(AuthEvents.OPEN_CREATE_ACCOUNT_DIALOG_EVENT);
         },
      },
      linkRef
   );

   const [state] = useState(
      () =>
         ({
            email: prepareState({
               label: "Email",
               schema: z.string().email(),
               type: "email",
            }),
            password: prepareState({
               label: "Email",
               schema: z.string().nonempty(),
               type: "password",
            }),
         } as const)
   );

   return (
      <div className="flex max-h-[75vh] w-[400px] max-w-full flex-col bg-zinc-900 p-4 text-black">
         <div className="flex h-16 w-full shrink-0 items-center justify-center">
            <Dialog.Title className="text-xl font-bold text-white">
               Sign In
            </Dialog.Title>
         </div>
         <motion.div className="mb-6 shrink-0 px-6">
            <AnimatePresence mode="wait" initial={false}>
               <motion.div
                  className="items-s flex h-full flex-col justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                     bounce: false,
                     ease: "easeOut",
                     duration: 0.2,
                  }}
               >
                  <Input labelKind="normal" name="Email" state={state.email} />
                  <Input labelKind="normal" name="Password" state={state.password} />
               </motion.div>
            </AnimatePresence>
         </motion.div>

         <div className="flex w-full justify-center text-sm text-white/80">
            <span>
               Don't have an account? Create one{" "}
               <span
                  ref={linkRef}
                  className="font-bold italic text-blue-600 hover:cursor-pointer"
                  {...buttonProps}
               >
                  here
               </span>
            </span>
         </div>
      </div>
   );
});
