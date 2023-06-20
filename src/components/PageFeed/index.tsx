"use client"

import { motion } from "framer-motion";

export type PageFeedProps = {
   handle: string;
};

export const PageFeed = (props: PageFeedProps) => {

   return <motion.div className="mt-1 flex flex-col gap-2">

   </motion.div>;
};

{
   /* <PageFeed >
   {posts.sort(comp).map((post) => {
      return <Post key={post.id} {...post} />;
   })}
</PageFeed>; */
}
