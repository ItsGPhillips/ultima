"use client";

import { Slot } from "@radix-ui/react-slot";
import { mergeRefs, mergeProps } from "@react-aria/utils";
import {
   ComponentPropsWithRef,
   RefObject,
   forwardRef,
   useEffect,
   useRef,
} from "react";
import {
   AriaButtonProps as LibAriaButtonProps,
   useButton,
   useFocus,
   useFocusRing,
} from "react-aria";
import { cn } from "~/utils/cn";

export type FocusEventProps = {
   onIsFocusVisible?: (ref: HTMLButtonElement) => void;
   focusedClass?: string;
   notFocusedClass?: string;
};

export type AriaButtonProps = {
   className?: string;
} & LibAriaButtonProps<"button"> &
   FocusEventProps;

export const AriaButton = forwardRef<HTMLButtonElement, AriaButtonProps>(
   (props, fref) => {
      const ref = useRef<HTMLButtonElement>(null);
      const { buttonProps } = useButton(props, ref);
      const { isFocusVisible, focusProps } = useFocusRing();

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
            {...mergeProps(focusProps, buttonProps)}
            className={cn(
               "text-md flex items-center justify-center rounded-full p-2 py-1 font-bold tracking-wide antialiased",
               isFocusVisible ? focusedClass : notFocusedClass,
               props.className
            )}
         >
            {props.children}
         </button>
      );
   }
);

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
