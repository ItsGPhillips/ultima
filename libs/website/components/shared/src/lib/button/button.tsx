"use client";

import { mergeRefs, mergeProps } from "@react-aria/utils";
import { ComponentPropsWithRef, forwardRef, useEffect, useRef } from "react";
import { useFocusRing } from "react-aria";
import { cn } from "@website/utils";

export type FocusEventProps = {
   onIsFocusVisible?: (ref: HTMLButtonElement) => void;
   focusedClass?: string;
   notFocusedClass?: string;
};

export const Button = forwardRef<
   HTMLButtonElement,
   ComponentPropsWithRef<"button"> & FocusEventProps
>((props, fref) => {
   const ref = useRef<HTMLButtonElement>(null);
   const { isFocusVisible, focusProps } = useFocusRing({
      within: true,
   });
   useEffect(() => {
      if (!ref.current) return;
      if (isFocusVisible) {
         props?.onIsFocusVisible?.(ref.current);
      }
   }, [isFocusVisible]);

   const notFocusedClass = props.notFocusedClass ?? "outline-none";
   const focusedClass =
      props.focusedClass ??
      "outline outline-2 outline-offset-2 outline-white/50";

   return (
      <button
         ref={mergeRefs(ref, fref)}
         {...mergeProps(props, focusProps)}
         className={cn(
            "text-md flex items-center justify-center rounded-full p-2 py-1 font-bold tracking-wide antialiased",
            isFocusVisible ? focusedClass : notFocusedClass,
            props.className
         )}
      >
         {props.children}
      </button>
   );
});
