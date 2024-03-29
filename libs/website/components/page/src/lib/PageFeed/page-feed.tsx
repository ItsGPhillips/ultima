"use client";

import {
   AnimatePresence,
   motion,
   useInView,
   useIsomorphicLayoutEffect,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
   UsePostsInfinateQueryOptions,
   usePostsInfinateQuery,
} from "@website/hooks";
import { Post } from "@website/components/post";
import { Spinner } from "@website/components/shared";
import { Player } from "@lottiefiles/react-lottie-player";
import useMeasure from "react-use-measure";
import { PostLoader } from "./loader";

export const revalidate = 0;

export type PageFeedProps =
   | { homeFeed: true }
   | { homeFeed?: false; handle: string };

export const PageFeed = (props: PageFeedProps) => {
   const queryArgs: UsePostsInfinateQueryOptions = props.homeFeed
      ? {
           homeFeed: props.homeFeed,
           handle: undefined,
           filter: "NEWEST",
           limit: 5,
        }
      : {
           homeFeed: props.homeFeed,
           handle: props.handle,
           filter: "NEWEST",
           limit: 5,
        };

   const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
      usePostsInfinateQuery(queryArgs);

   const posts = data?.pages.flat();

   const [mref, bounds] = useMeasure();
   useIsomorphicLayoutEffect(() => {
      document.body.style.setProperty("--feed-width", `${bounds.width}px`);
   }, [bounds.width]);

   const ref = useRef<HTMLDivElement>(null);
   const [showSpinner, setShowSpinner] = useState(false);
   const isInView = useInView(ref);

   useEffect(() => {
      if (!isInView) {
         setShowSpinner(false);
         return;
      }
      if (isLoading || isFetching) {
         setShowSpinner(true);
      } else {
         const timeout = setTimeout(() => {
            setShowSpinner(false);
         }, 1000);
         return () => clearTimeout(timeout);
      }
   }, [isLoading || isFetching, isInView]);

   return (
      <div ref={mref} className="">
         <AnimatePresence mode="popLayout">
            <motion.div
               layoutRoot
               className="flex h-full flex-col items-stretch"
            >
               <motion.div ref={ref} className="h-1">
                  {showSpinner && (
                     <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                           opacity: 1,
                           transition: {
                              opacity: { duration: 0.2 },
                           },
                        }}
                        exit={{
                           opacity: 0,
                           transition: {
                              opacity: { duration: 0.1, delay: 5 },
                           },
                        }}
                        className="flex w-full items-center justify-center pl-10 min-h-[2px]"
                     >
                        <div className="h-10 w-10">
                           <Spinner />
                        </div>
                     </motion.div>
                  )}
               </motion.div>
               {posts && posts.length >= 1 ? (
                  <>
                     {posts?.map((post) => {
                        return <>
                           <Post key={post.id} {...post} />
                           <div key={"_" + post.id} className="h-1"></div>
                        </> 
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
