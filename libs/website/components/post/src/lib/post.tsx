"use client";

import { env } from "@website/env";
import { PropsWithChildren } from "react";
import { Avatar, Seperator, Carousel } from "@website/components/shared";
import { useRichTextEditor } from "@website/hooks";
import { VoteButtonGroup } from "./VoteButtonGroup";
import { ActionButton } from "./Actionbutton";
import { LuMessageSquare, LuPin } from "react-icons/lu";
import { IoShareSocial } from "react-icons/io5";
import { RxDotsHorizontal } from "react-icons/rx";
import Link from "next/link";
import { type Post as PostType } from "@website/database";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { EditorContent } from "@tiptap/react";
import NextImage from "next/image";
import { motion } from "framer-motion";

const PostInfo = (props: PostType) => {
   return (
      <div className="flex items-center gap-2">
         <Link href="#">
            <Avatar name={props.handle} className="float-left block h-8 w-8" />
         </Link>
         <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
               <Link href="#" className="text-link">
                  <span className="whitespace-nowrap text-sm">
                     {props.handle}
                  </span>
               </Link>
               <Seperator.Dot />
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

const ImageDisplay = (props: { name: string }) => {
   const image = new Image();
   image.src = `${env.NEXT_PUBLIC_CLOUDFLARE_STORAGE_URL}/${props.name}`;
   return (
      <div className="flex h-full w-full items-stretch justify-center bg-black/60 px-1">
         <NextImage
            src={`${env.NEXT_PUBLIC_CLOUDFLARE_STORAGE_URL}/${props.name}`}
            alt={""}
            width={0}
            height={0}
            sizes="100vh"
            loading="lazy"
            quality={80}
            className="object-contain"
            style={{
               width: "auto",
               height: "100%",
            }}
            blurDataURL="/image-placeholder.jpeg"
         />
      </div>
   );
};

export const Post = (props: PropsWithChildren<PostType>) => {
   const editor = useRichTextEditor({
      editable: false,
      content: props.body,
      autofocus: false,
   });

   const images = props.images ?? [];

   return (
      <motion.div
         layout
         className="isolate z-[400] flex rounded-md outline-[1px] outline-white/50 hover:outline"
         style={{ overflowAnchor: "none" }}
      >
         <VoteButtonGroup
            postId={props.id}
            className="mt-2 hidden flex-col gap-2 md:flex"
         />
         <div className="flex h-fit min-h-max flex-1 flex-col gap-2 rounded-md bg-zinc-800 p-3 pb-0">
            <PostInfo {...props} />
            <div className="flex flex-col items-stretch gap-2">
               {editor.getText().trim().length > 0 && (
                  <EditorContent
                     editor={editor}
                     autoFocus={false}
                     scrolling="no"
                  />
               )}
               {images.length > 0 && (
                  <Carousel className="h-[24rem]">
                     {images.map((name) => {
                        return (
                           <Carousel.Slide className="relative" key={name}>
                              <ImageDisplay name={name} />
                           </Carousel.Slide>
                        );
                     })}
                  </Carousel>
               )}
            </div>
            <div className="flex w-full items-stretch gap-2 border-t-[1px] border-white/20 md:gap-4">
               <VoteButtonGroup postId={props.id} className="flex md:hidden" />
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
      </motion.div>
   );
};
