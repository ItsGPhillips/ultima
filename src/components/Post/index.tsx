"use client";

import { PropsWithChildren } from "react";
import { UserAvatar } from "../shared/UserAvatar";
import { VoteButtonGroup } from "./VoteButtonGroup";
import { ActionButton } from "./Actionbutton";
import { LuMessageSquare, LuPin } from "react-icons/lu";
import { IoShareSocial } from "react-icons/io5";
import { RxDotsHorizontal } from "react-icons/rx";
import Link from "next/link";
import { SeperatorDot } from "../shared/SeperatorDot";
import { Post as PostType } from "~/server/database/types";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { EditorContent } from "@tiptap/react";
import { useRichTextEditor } from "~/hooks/useRichTextEditor";

const PostInfo = (props: PostType) => {
   return (
      <div className="flex items-center gap-2">
         <Link href="#">
            <UserAvatar
               name={props.handle}
               className="float-left block h-8 w-8"
            />
         </Link>
         <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
               <Link href="#" className="text-link">
                  <span className="whitespace-nowrap text-sm">
                     {props.handle}
                  </span>
               </Link>
               <SeperatorDot />
               <Link href="#" className="text-link">
                  <span className="whitespace-nowrap text-sm">
                     {props.posterHandle}
                  </span>
               </Link>
            </div>
            <div className="text-xs text-white/50">
               {formatDistanceToNowStrict(new Date(props.postedAt), {
                  addSuffix: true,
               })}
            </div>
         </div>
      </div>
   );
};

export const Post = (props: PropsWithChildren<PostType>) => {
   const editor = useRichTextEditor({ editable: false, content: props.body });

   return (
      <div className="isolate z-[400] flex rounded-md outline-[1px] outline-white/50 hover:outline">
         <VoteButtonGroup className="mt-2 hidden flex-col gap-2 md:flex" />
         <div className="flex h-fit min-h-max flex-1 flex-col gap-2 rounded-md bg-zinc-800 p-3 pb-0">
            <PostInfo {...props} />
            <h4 className="block text-xl">{props.title}</h4>

            <EditorContent editor={editor} className="min-h-[4rem]" />
            {/* <p className="max-w-[80ch] text-sm">{props.body}</p> */}

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
