"use client";

import { Spinner } from "@website/components/shared";
import { useInView, AnimatePresence, motion } from "framer-motion";
import { useRef, useEffect } from "react";

export const PostLoader = (props: {
   hasNextPage: boolean;
   onInView: () => void;
}) => {
   const ref = useRef<HTMLDivElement>(null);
   const isInView = useInView(ref, { amount: "some" });
   useEffect(() => {
      if (isInView) {
         props.onInView();
      }
   }, [isInView]);

   return (
      <div
         ref={ref}
         className="flex h-20  w-full flex-col items-center justify-center gap-2"
      >
         <AnimatePresence mode="popLayout">
            {!!(isInView && props.hasNextPage) && (
               <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center justify-center gap-2"
               >
                  <div className="h-6 w-6">
                     <Spinner />
                  </div>
                  <div className="select-none whitespace-nowrap text-sm text-white/75">
                     Loading more posts...
                  </div>
               </motion.div>
            )}

            {!props.hasNextPage && (
               <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="select-none whitespace-nowrap text-sm text-white/75"
               >
                  No more posts
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};
