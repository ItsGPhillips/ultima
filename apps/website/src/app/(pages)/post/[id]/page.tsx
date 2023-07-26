"use client";

import { Post, PostBody, PostInfo } from "@website/components/post";
import { AriaButton, Avatar, Seperator } from "@website/components/shared";
import {
   useCommentsQuery,
   usePageAccentColor,
   usePostQuery,
} from "@website/hooks";
import Color from "color";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";

const CommentInfo = (props: { handle: string; postedAt: string }) => {
   const { data: accentColor } = usePageAccentColor({
      handle: props.handle,
   });

   return (
      <div className="flex items-center gap-2">
         <Link href={`page/${props.handle}`}>
            <Avatar
               color={new Color(accentColor ?? "#ffffff4d")}
               name={props.handle}
               className="float-left block h-8 w-8"
            />
         </Link>
         <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
               <Link href={`page/${props.handle}`} className="text-link">
                  <span className="whitespace-nowrap text-sm">
                     {props.handle}
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

const CommentsSection = (props: { postId: string }) => {
   return (
      <div className="w-full flex flex-col gap-2">
         <Seperator className=""/>
         <div className="flex justify-between px-4">
            <div className="text-xl flex items-center">Comments</div>
            <AriaButton className="border-2 border-green-400 bg-green-400/30 px-4">
               New Comment
            </AriaButton>
         </div>
         <CommentList postId={props.postId} parentId={null} />
      </div>
   );
};

const CommentList = (props: { postId: string; parentId: number | null }) => {
   const { data } = useCommentsQuery(props);

   return (
      <div className="flex flex-col gap-2 px-4">
         {data?.map((comment) => {
            return (
               <div key={comment.id}>
                  <CommentInfo
                     handle={comment.handle}
                     postedAt={comment.postedAt}
                  />
                  <div className="text-md p-2">{comment.comment}</div>
               </div>
            );
         })}
      </div>
   );
};

const Page = (props: { params: { id: string } }) => {
   const { data: post } = usePostQuery({ postId: props.params.id });

   if (!post) {
      return null;
   }

   return (
      <div className="flex w-full flex-col p-1">
         <div className="p-4">
            <PostInfo {...post} />
         </div>
         <PostBody {...post} />
         <CommentsSection postId={props.params.id} />
      </div>
   );
};

export default Page;
