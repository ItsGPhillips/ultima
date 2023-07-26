"use client";

import {
   motion,
   useMotionTemplate,
   useScroll,
   useTransform,
} from "framer-motion";
import { cn } from "@website/utils";
import { PropsWithChildren } from "react";

export const PageBanner = (props: PropsWithChildren) => {
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
            {props.children}
         </motion.div>
      </div>
   );
};

