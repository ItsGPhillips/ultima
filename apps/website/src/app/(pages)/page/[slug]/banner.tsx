"use client";

import { cn } from "@website/utils";
import Image from "next/image";

export const Banner = (props: { title: string }) => {
   return (
      <>
         <Image
            src="/test-banner.jpg"
            alt=""
            fill
            className="object-cover"
            quality={100}
            priority
         />
         <div className="absolute inset-0 top-[50%] bg-gradient-to-t from-black/80 to-transparent" />
         <h1
            className={cn(
               "z-[200] flex w-full grow-0 flex-col justify-end p-2 text-4xl font-bold shadow-black drop-shadow-2xl",
               "tmd:hidden sm:w-[670px] md:w-[717px] md:pb-2 md:pl-14"
            )}
         >
            {props.title}
         </h1>
      </>
   );
};
