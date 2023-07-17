"use client";

import { useInView } from "framer-motion";

import { cn } from "@website/utils";
import { VoteButton } from "./VoteButton";
import { useEffect, useRef, useState } from "react";
import { usePostVoteMutation, useUserPostVotesQuery } from "@website/hooks";

export const VoteButtonGroup = (props: {
   className?: string;
   postId: string;
}) => {
   const ref = useRef<HTMLDivElement>(null);
   // const isInView = useInView(ref, { amount: "some" });
   const { data } = useUserPostVotesQuery({ postId: props.postId });
   const { mutate } = usePostVoteMutation({ postId: props.postId });

   const isUpvote = data?.isUpvote ?? false;

   return (
      <div ref={ref} className={cn("items-center", props.className)}>
         <VoteButton
            isActive={isUpvote}
            variant="up"
            onPress={() => {
               mutate({ isUpvote: true });
            }}
         />
         <span className="shrink-0 font-bold">{0}</span>
         <VoteButton
            isActive={!isUpvote}
            variant="down"
            onPress={() => {
               mutate({ isUpvote: false });
            }}
         />
      </div>
   );
};
