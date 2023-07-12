"use client";

import * as RadixAvatar from "@radix-ui/react-avatar";
import { cn } from "@website/utils";

import { Roboto_Mono } from "next/font/google";
const font = Roboto_Mono({ weight: ["700"], subsets: ["latin-ext"] });

export type AvatarProps = {
   imageUrl?: string;
   name: string;
   className?: string;
};

export const Avatar: React.FC<AvatarProps> = (props) => {
   const [c0, c1, c2] = props.name
      .split(" ")
      .map((name) => name[0]?.toLocaleUpperCase());
   return (
      <RadixAvatar.Root
         className={cn(
            "flex h-10 w-10 flex-shrink-0 flex-row items-center gap-4 self-center overflow-hidden rounded-md",
            props.className
         )}
         aria-label="User Avatar"
      >
         <RadixAvatar.Image
            src={props.imageUrl}
            alt="Colm Tuite"
            className="h-full w-full object-cover"
         />
         <RadixAvatar.Fallback
            className={cn(
               "flex h-full w-full items-center justify-center rounded-full text-center align-middle text-xl font-bold text-black/80 subpixel-antialiased",
               font.className
            )}
            delayMs={0}
            style={{
               backgroundColor: `hsl(${Math.random() * 100}, 100%, 80%)`,
            }}
         >
            {c0}
            {c1 ?? null}
            {c2 ?? null}
         </RadixAvatar.Fallback>
      </RadixAvatar.Root>
   );
};
