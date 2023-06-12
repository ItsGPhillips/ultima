import { PropsWithChildren } from "react";
import { UserAvatar } from "../shared/UserAvatar";
import { VoteButtonGroup } from "./VoteButtonGroup";
import { ActionButton } from "./Actionbutton";

import { LuMessageSquare, LuPin } from "react-icons/lu";
import { IoShareSocial } from "react-icons/io5";
import { RxDotsHorizontal } from "react-icons/rx";
import Link from "next/link";
import { SeperatorDot } from "../SeperatorDot";

const PostInfo = () => {
   return (
      <div className="flex items-center gap-2">
         <Link href="#">
            <UserAvatar name="Test Name" className="float-left block h-8 w-8" />
         </Link>
         <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
               <Link href="#" className="text-link">
                  <span className="whitespace-nowrap text-sm">My Group</span>
               </Link>
               <SeperatorDot />
               <Link href="#" className="text-link">
                  <span className="whitespace-nowrap text-sm">u/user-name</span>
               </Link>
            </div>
            <div className="text-xs text-white/50">12 months ago</div>
         </div>
      </div>
   );
};

export const Post = (props: PropsWithChildren) => {
   return (
      <div className="flex gap-2 isolate z-[400] mx-2 outline-[1px] hover:outline outline-white/50 rounded-md">
         <VoteButtonGroup className="mt-2 hidden flex-col gap-2 md:flex" />
         <div className="flex h-fit flex-1 flex-col gap-2 rounded-md bg-zinc-800 p-3 pb-0">
            <PostInfo />
            <h4 className="block text-xl">Title Here</h4>
            <p className="max-w-[80ch] text-sm">
               Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem
               architecto nostrum labore perferendis ea ut illo delectus aperiam
               Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam
               distinctio velit esse. Animi rerum doloribus numquam inventore.
               Porro sunt amet dicta, veniam praesentium ab laborum
               exercitationem, assumenda ipsam reiciendis doloremque? Lorem
               ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
               repellat iste nisi quas dolore corporis quo molestias eos at
               mollitia tenetur omnis minus adipisci totam sunt nulla sit,
               pariatur eius?
            </p>
            <div className="flex w-full items-stretch gap-2 border-t-[1px] border-white/20 md:gap-4">
               <VoteButtonGroup className="flex md:hidden" />
               <ActionButton className="group relative aspect-square min-w-fit md:aspect-auto [&>*]:hover:opacity-100">
                  <LuMessageSquare className="scale-[1.2] transform stroke-white opacity-80" />
                  <span className="hidden whitespace-nowrap text-xs text-white opacity-60 md:ml-2 md:block">
                     123 Comments
                  </span>
               </ActionButton>
               <ActionButton className="aspect-square min-w-fit md:aspect-auto [&>*]:hover:opacity-100">
                  <LuPin className="scale-[1.1] transform stroke-white opacity-80" />
                  <span className="hidden whitespace-nowrap text-xs text-white opacity-60 md:ml-2 md:block">
                     Save
                  </span>
               </ActionButton>
               <ActionButton className="aspect-square min-w-fit md:aspect-auto [&>*]:hover:opacity-100">
                  <IoShareSocial className="scale-[1.1] transform fill-white opacity-80" />
                  <span className="hidden whitespace-nowrap text-xs text-white opacity-60 md:ml-2 md:block">
                     Share
                  </span>
               </ActionButton>
               <ActionButton className="ml-auto aspect-square min-w-fit md:aspect-auto [&>*]:hover:opacity-100">
                  <RxDotsHorizontal className="scale-[1.1] transform fill-white opacity-80" />
               </ActionButton>
            </div>
         </div>
      </div>
   );
};
