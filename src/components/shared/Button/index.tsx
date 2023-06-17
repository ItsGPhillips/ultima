"use client";

import { mergeRefs } from "@react-aria/utils";
import { forwardRef, useRef } from "react";
import { AriaButtonProps, useButton } from "react-aria";
import { cn } from "~/utils/cn";

export type SubscribeButtonProps = AriaButtonProps<"button"> & {
   className?: string;
};

export const Button = forwardRef<HTMLButtonElement, SubscribeButtonProps>(
   (props, fref) => {
      const ref = useRef<HTMLButtonElement>(null);
      const { buttonProps } = useButton(props, ref);
      return (
         <button
            ref={mergeRefs(ref, fref)}
            {...buttonProps}
            className={cn(
               "text-md flex items-center justify-center rounded-full p-2 py-1 font-bold tracking-wide antialiased",
               props.className
            )}
         >
            {props.children}
         </button>
      );
   }
);
