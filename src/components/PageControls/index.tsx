"use client";

import { Item } from "react-stately";
import { Select } from "./Select";
import { cn } from "~/utils/cn";
import { useBoolean } from "usehooks-ts";
import { useId, useRef } from "react";
import { useButton } from "react-aria";
import { motion, useMotionValue, useTransform } from "framer-motion";
import theme from "tailwindcss/defaultTheme";

const SubscribeButton = () => {
   const isSubscribed = useBoolean(false);
   const ref = useRef<HTMLButtonElement>(null);
   const { buttonProps } = useButton(
      {
         onPress() {
            isSubscribed.toggle();
         },
      },
      ref
   );
   const className = isSubscribed.value
      ? cn(
           "ml-auto border-2 px-4 py-1 font-bold text-white antialiased rounded-full",
           "border-green-500 bg-green-500/40 outline-none transistion-all"
        )
      : cn(
           "ml-auto border-2 px-4 py-1 font-bold text-white antialiased rounded-full",
           "border-blue-500 bg-blue-500/40 outline-none transistion-all"
        );

   return (
      <motion.button className={className} {...(buttonProps as any)}>
         <motion.span>
            {isSubscribed.value ? "Subscribed" : "Subscribe"}
         </motion.span>
      </motion.button>
   );
};

export const PageControls = () => {
   return (
      <div
         id="feed-controls"
         className={cn(
            "pl-2 pr-2 md:pl-14",
            "sticky top-[var(--header-height)] isolate z-[450] flex h-14 items-center bg-zinc-900 py-2"
         )}
      >
         <Select defaultSelectedKey={"popular"}>
            <Item key="popular">Popular</Item>
            <Item key="newest">Newest</Item>
            <Item key="top">Top</Item>
         </Select>

         <SubscribeButton />
      </div>
   );
};
