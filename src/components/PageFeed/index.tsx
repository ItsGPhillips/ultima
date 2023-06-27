"use client";

import {
   AnimatePresence,
   motion,
   useInView,
   useIsomorphicLayoutEffect,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { usePostsInfinateQuery } from "~/hooks/queries/posts";
import { Post } from "../Post";
import { Spinner } from "../shared/Spinner";
import { Player } from "@lottiefiles/react-lottie-player";
import useMeasure from "react-use-measure";
import { useUser } from "@clerk/nextjs";

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

export const NoPosts = () => {
   return;
};

export const PageFeed = (props: PageFeedProps) => {
   const { data, fetchNextPage, hasNextPage } = usePostsInfinateQuery({
      handle: props.handle,
      sortBy: "NEWEST",
   });

   const posts = data?.pages.flat();

   const [mref, bounds] = useMeasure();
   useIsomorphicLayoutEffect(() => {
      document.body.style.setProperty("--feed-width", `${bounds.width}px`);
   }, [bounds.width]);

   return (
      <motion.div ref={mref} className="mt-1 flex flex-col items-stretch gap-2">
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
      </motion.div>
   );
};
