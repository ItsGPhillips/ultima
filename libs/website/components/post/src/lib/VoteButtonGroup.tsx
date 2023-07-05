"use client";

import { cn } from "@website/utils";
import { VoteButton } from "./VoteButton";

export const VoteButtonGroup = (props: { className?: string }) => {
   // TODO(George): mutation and query hooks for reading and writing vote state.
   return (
      <div className={cn("items-center", props.className)}>
         <VoteButton variant="up" onChange={() => {}} />
         <span className="shrink-0 font-bold">123</span>
         <VoteButton variant="down" onChange={() => {}} />
      </div>
   );
};
