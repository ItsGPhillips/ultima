"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
   AriaButton,
   Avatar,
   Popover,
   Spinner,
} from "@website/components/shared";
import { useState, useTransition } from "react";
import { Profile } from "@website/database";
import { api } from "@website/api/client";

export const UserAvatar = (props: { profile: Profile; handle: string }) => {
   const [menuOpen, setMenuOpen] = useState(false);
   const [loading, transition] = useTransition();
   return (
      <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
         <Popover.Trigger className="my-1 ml-auto mr-4 flex items-center gap-4 rounded-md p-2 hover:bg-white/5">
            <div className="flex flex-col items-end">
               <div className="bold hidden text-sm sm:block">{`${props.profile.firstName} ${props.profile.lastName}`}</div>
               <div className="hidden text-xs italic text-white/70 sm:block">{`@${props.handle}`}</div>
            </div>
            <Avatar name={props.handle} />
         </Popover.Trigger>
         <AnimatePresence>
            {menuOpen && (
               <Popover.Portal forceMount>
                  <Popover.Content forceMount asChild>
                     <motion.div
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        transition={{
                           duration: 0.2,
                           ease: "easeOut",
                        }}
                        className="z-[1000] m-1 w-[260px] rounded-2xl bg-zinc-800 p-5 shadow-xl shadow-black/50"
                     >
                        <div className="flex flex-col items-stretch gap-2">
                           <span>{`${props.profile.firstName} ${props.profile.lastName}`}</span>
                           <span>Account</span>
                           <span>Settings</span>
                           <AriaButton
                              className="rounded-lg border-2 border-red-400 bg-red-400/30 px-2 py-1 text-sm text-white hover:bg-red-400/50"
                              onPress={async () => {
                                 await api.auth.signOut.mutate().then(() => {
                                    window.location.reload();
                                 });
                              }}
                           >
                              {loading ? <Spinner /> : "Sign Out"}
                           </AriaButton>
                        </div>
                     </motion.div>
                  </Popover.Content>
               </Popover.Portal>
            )}
         </AnimatePresence>
      </Popover.Root>
   );
};
