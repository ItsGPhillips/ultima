"use client";

import {
   AnimatePresence,
   motion,
   useInView,
   useIsomorphicLayoutEffect,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePostsInfinateQuery } from "@website/hooks";
import { Post } from "@website/components/post";
import { Spinner } from "@website/components/shared";
import { Player } from "@lottiefiles/react-lottie-player";
import useMeasure from "react-use-measure";

export type PageFeedProps = {
   handle: string;
};

const PostLoader = (props: { hasNextPage: boolean; onInView: () => void }) => {
   const ref = useRef<HTMLDivElement>(null);
   const isInView = useInView(ref);
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

export const PageFeed = (props: PageFeedProps) => {
   const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
      usePostsInfinateQuery({
         handle: props.handle,
         sortBy: "NEWEST",
      });

   const posts = data?.pages.flat();

   const [mref, bounds] = useMeasure();
   useIsomorphicLayoutEffect(() => {
      document.body.style.setProperty("--feed-width", `${bounds.width}px`);
      console.log(bounds.width);
   }, [bounds.width]);

   const [showSpinner, setShowSpinner] = useState(false);
   useEffect(() => {
      if (isLoading || isFetching) {
         setShowSpinner(true);
      } else {
         const timeout = setTimeout(() => {
            setShowSpinner(false);
         }, 1000);
         return () => clearTimeout(timeout);
      }
   }, [isLoading || isFetching]);

   return (
      <div ref={mref} className="mt-1">
         <AnimatePresence mode="popLayout">
            <motion.div
               layoutRoot
               className="flex flex-col items-stretch gap-2"
            >
               {showSpinner && (
                  <motion.div
                     layout
                     initial={{ opacity: 0, scale: 0.5 }}
                     animate={{
                        opacity: 1,
                        // scale: 1,
                        transition: {
                           opacity: { duration: 0.2 },
                           // scale: { duration: 0.3 },
                        },
                     }}
                     exit={{
                        opacity: 0,
                        // scale: 0.5,
                        transition: {
                           opacity: { duration: 0.1, delay: 5 },
                           // scale: { duration: 0.3, delay: 5 },
                        },
                     }}
                     className="flex w-full items-center justify-center pl-10"
                  >
                     <div className="h-10 w-10">
                        <Spinner />
                     </div>
                  </motion.div>
               )}

               {posts && posts.length >= 1 ? (
                  <>
                     {posts?.map((post) => {
                        return <Post key={post.id} {...post} />;
                     })}
                     <PostLoader
                        hasNextPage={Boolean(hasNextPage)}
                        onInView={() => {
                           if (hasNextPage) {
                              fetchNextPage();
                           }
                        }}
                     />
                  </>
               ) : (
                  <>
                     {!isLoading && (
                        <>
                           <div className="mt-2 flex items-center justify-center p-2 text-2xl font-bold">
                              This page has no posts
                           </div>
                           <Player
                              autoplay
                              loop
                              src="https://assets10.lottiefiles.com/packages/lf20_WpDG3calyJ.json"
                              style={{ width: "50%" }}
                              className="opacity-50"
                           />
                        </>
                     )}
                  </>
               )}
            </motion.div>
         </AnimatePresence>
      </div>
   );
};
