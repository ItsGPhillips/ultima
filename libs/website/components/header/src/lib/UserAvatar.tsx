"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
   AriaButton,
   Avatar,
   Popover,
} from "@website/components/shared";
import { useState } from "react";
import { Profile } from "@website/database";
import { api } from "@website/api/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Color from "color";

export const UserAvatar = (props: { profile: Profile; handle: string, accentColor: string}) => {
   const [menuOpen, setMenuOpen] = useState(false);
   const router = useRouter();
   return (
      <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
         <Popover.Trigger className="my-1 flex items-center gap-4 rounded-md p-1 px-2 hover:bg-white/5">
            <div className="flex flex-col items-end">
               <div className="hidden text-sm font-semibold sm:block">{`${props.profile.firstName} ${props.profile.lastName}`}</div>
               <div className="hidden text-xs italic text-white/70 sm:block">{`@${props.handle}`}</div>
            </div>
            <Avatar color={new Color(props.accentColor)} name={props.handle} />
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
                           duration: 0.1,
                           ease: "easeOut",
                        }}
                        className="z-[1000] m-2 w-[260px] rounded-2xl border-[1px] border-zinc-600 bg-zinc-800 p-5 shadow-xl shadow-black/50"
                     >
                        <div className="flex flex-col items-stretch gap-2">
                           <span>{`${props.profile.firstName} ${props.profile.lastName}`}</span>

                           <Link
                              href={`/page/${props.handle}`}
                              className="text-link"
                           >
                              Profile Page
                           </Link>

                           <span>Account</span>
                           <span>Settings</span>
                           <AriaButton
                              className="rounded-lg border-2 border-red-400 bg-red-400/30 px-2 py-1 text-sm text-white hover:bg-red-400/50"
                              onPress={async () => {
                                 await api.auth.signOut.mutate().then(() => {
                                    router.refresh();
                                 });
                              }}
                           >
                              Sign Out
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
