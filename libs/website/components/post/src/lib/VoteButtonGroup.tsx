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

   let hasVote = false;
   let isUpvote = true;
   if (data && data.isUpvote !== null) {
      hasVote = true;
      isUpvote = data.isUpvote;
   }

   return (
      <div ref={ref} className={cn("items-center", props.className)}>
         <VoteButton
            isActive={hasVote && isUpvote}
            variant="up"
            onPress={() => {
               if(hasVote && isUpvote) {
                  mutate({ isUpvote: null });
               } else {
                  mutate({ isUpvote: true });
               }
            }}
         />
         <span className="shrink-0 font-bold">{0}</span>
         <VoteButton
            isActive={hasVote && !isUpvote}
            variant="down"
            onPress={() => {
               if(hasVote && !isUpvote) {
                  mutate({ isUpvote: null });
               } else {
                  mutate({ isUpvote: false });
               }
            }}
         />
      </div>
   );
};
