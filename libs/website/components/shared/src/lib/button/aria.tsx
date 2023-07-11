"use client";

import { mergeRefs } from "@react-aria/utils";
import { forwardRef, useRef, useEffect } from "react";
import {
   AriaButtonProps as LibAriaButtonProps,
   useButton,
   useFocusRing,
   mergeProps,
   useHover,
   HoverProps,
} from "react-aria";
import { cn } from "@website/utils";
import type { FocusEventProps } from "./button";

export type AriaButtonProps = {
   className?: string;
} & LibAriaButtonProps<"button"> &
   HoverProps &
   FocusEventProps;

export const AriaButton = forwardRef<HTMLButtonElement, AriaButtonProps>(
   (props, fref) => {
      const ref = useRef<HTMLButtonElement>(null);
      const { buttonProps } = useButton(props, ref);
      const { isFocusVisible, focusProps } = useFocusRing();
      const { hoverProps } = useHover(props);
      const notFocusedClass = props.notFocusedClass ?? "outline-none";
      const focusedClass =
         props.focusedClass ??
         "outline outline-2 outline-offset-2 outline-white/50";

      useEffect(() => {
         if (!ref.current) return;
         if (isFocusVisible) {
            props?.onIsFocusVisible?.(ref.current);
         }
      }, [isFocusVisible]);

      return (
         <button
            ref={mergeRefs(ref, fref)}
            {...mergeProps(focusProps, buttonProps, hoverProps)}
            className={cn(
               "text-md flex select-none items-center justify-center whitespace-nowrap rounded-full p-2 py-1 font-bold tracking-wide antialiased",
               isFocusVisible ? focusedClass : notFocusedClass,
               props.className
            )}
         >
            {props.children}
         </button>
      );
   }
);
