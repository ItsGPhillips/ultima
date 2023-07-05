"use client";
import { AriaButtonProps, useButton } from "@react-aria/button";
import { mergeProps } from "@react-aria/utils";
import { PropsWithChildren, forwardRef, useRef } from "react";
import { cn } from "@website/utils";

export const ActionButton = forwardRef<
   HTMLButtonElement,
   PropsWithChildren<AriaButtonProps & { className?: string }>
>((props, fref) => {
   const ref = useRef<HTMLButtonElement>(null);
   const { buttonProps } = useButton(props, ref);
   return (
      <button
         ref={mergeProps(ref, fref)}
         {...buttonProps}
         className={cn(
            "flex h-10 items-center justify-center rounded-md p-2 outline-none",
            props.className
         )}
      >
         {props.children}
      </button>
   );
});
