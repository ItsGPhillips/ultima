"use client";

import {
   AnimatePresence,
   motion,
   useInView,
   useIsomorphicLayoutEffect,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useFeedPostsQuery, usePostsInfinateQuery } from "@website/hooks";
import { Post } from "@website/components/post";
import { Spinner } from "@website/components/shared";
import { Player } from "@lottiefiles/react-lottie-player";
import useMeasure from "react-use-measure";
import { PostLoader } from "./loader";

export const revalidate = 0;

export type PageFeedProps = {
   handle: string;
};

export const PageFeed = (props: PageFeedProps) => {
   const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
      useFeedPostsQuery({
         filter: "NEWEST",
      });
      
   // const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
   //    usePostsInfinateQuery({
   //       handle: props.handle,
   //       sortBy: "NEWEST",
   //    });

   const posts = data?.pages.flat();

   const [mref, bounds] = useMeasure();
   useIsomorphicLayoutEffect(() => {
      document.body.style.setProperty("--feed-width", `${bounds.width}px`);
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
               className="flex flex-col items-stretch gap-2 h-full"
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
