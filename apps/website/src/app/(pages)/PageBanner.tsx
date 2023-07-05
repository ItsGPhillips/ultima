"use client";

import {
   motion,
   useMotionTemplate,
   useScroll,
   useTransform,
} from "framer-motion";
import NextImage from "next/image";
import { cn } from "@website/utils";

export const PageBanner = (props: { title: string }) => {
   const { scrollY } = useScroll({ axis: "y" });
   const offset = useTransform(scrollY, (v) => {
      return v / 2;
   });

   const transform = useMotionTemplate`translateY(${offset}px)`;

   return (
      <div className="relative flex h-60 w-full shrink-0 justify-center overflow-hidden">
         <motion.div
            className="absolute inset-0 z-[100] "
            style={{ transform }}
         >
            <NextImage
               src="/test-banner.jpg"
               alt=""
               fill
               className="object-cover"
               quality={100}
               priority
            />
            <div className="absolute inset-0 top-[50%] bg-gradient-to-t from-black/80 to-transparent" />
         </motion.div>
         <h1
            className={cn(
               "z-[200] flex w-full grow-0 flex-col justify-end p-2 text-4xl font-bold shadow-black drop-shadow-2xl",
               "tmd:hidden sm:w-[670px] md:w-[717px] md:pb-2 md:pl-14"
            )}
         >
            {props.title}
         </h1>
      </div>
   );
};
