"use client";

import * as RadixAvatar from "@radix-ui/react-avatar";
import { cn } from "@website/utils";
import Color from "color";

// import Local from "next/font/local";

// const font = Local({
//    src: [
//       {
//          path: "./fonts/Roboto-Regular.ttf",
//          weight: "400",
//          style: "normal",
//       },
//       {
//          path: "./fonts/Roboto-Bold.ttf",
//          weight: "700",
//          style: "bold",
//       },
//       {
//          path: "./fonts/Roboto-Italic.ttf",
//          weight: "400",
//          style: "italic",
//       },
//       {
//          path: "./fonts/Roboto-Light.ttf",
//          weight: "400",
//          style: "normal",
//       },
//       {
//          path: "./fonts/Roboto-LightItalic.ttf",
//          weight: "400",
//          style: "italic",
//       },
//    ],
// });

// import { Inter } from "next/font/google";
// const font = Inter({ weight: ["700"], subsets: ["latin"], display: 'swap', adjustFontFallback: false });

export type AvatarProps = {
   imageUrl?: string;
   color: Color;
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
            )}
            delayMs={0}
            style={{
               backgroundColor: props.color.hex(),
            }}
         >
            {c0}
            {c1 ?? null}
            {c2 ?? null}
         </RadixAvatar.Fallback>
      </RadixAvatar.Root>
   );
};
