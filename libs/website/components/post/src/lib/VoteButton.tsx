"use client";
import { useButton } from "@react-aria/button";
import { mergeRefs } from "@react-aria/utils";
import { ToggleProps } from "@react-stately/toggle";
import { useAnimate } from "framer-motion";
import { ComponentProps, forwardRef } from "react";

import {
   BsFillCaretDownFill,
   BsCaretDown,
   BsCaretUp,
   BsCaretUpFill,
} from "react-icons/bs";
import colors from "tailwindcss/colors";
import { cn } from "@website/utils";


export const VoteButton = forwardRef<
   HTMLButtonElement,
   ComponentProps<"button"> & {
      isActive: boolean;
      onPress: () => void,
      variant: "up" | "down";
   } & ToggleProps
>((props, fref) => {
   const [ref, animate] = useAnimate<HTMLButtonElement>();
   const { buttonProps } = useButton(
      {
         onPress() {
            props.onPress();
            animate(
               ref.current,
               {
                  outlineOffset: ["-5px", "0px"],
                  outlineWidth: ["0px", "3px", "0px"],
                  outlineColor: [
                     "rgba(255,255,255, 0.5)",
                     "rgba(255,255,255, 0)",
                  ],
               },
               {
                  duration: 0.4,
                  ease: "easeOut",
               }
            );
         },
      },
      ref
   );

   const button = {
      down: [
         <BsCaretDown className="translate-y-[1px] scale-[1.3] transform fill-white/75" />,
         <BsFillCaretDownFill
            fill={colors.orange["400"]}
            className="translate-y-[1px] scale-[1.3] transform"
         />,
      ],
      up: [
         <BsCaretUp className="-translate-y-[1px] scale-[1.3] transform fill-white/75" />,
         <BsCaretUpFill
            fill={colors.orange["400"]}
            className="-translate-y-[1px] scale-[1.3] transform"
         />,
      ],
   };

   return (
      <button
         ref={mergeRefs(fref, ref)}
         {...buttonProps}
         className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full outline outline-transparent",
            props.className
         )}
      >
         {button[props.variant][props.isActive ? 1 : 0]}
      </button>
   );
});
