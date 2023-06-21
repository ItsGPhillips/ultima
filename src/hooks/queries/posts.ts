import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getPostsAction } from "~/server/actions/post";

export const usePostsInfinateQuery = (options: {
   handle: string;
   sortBy: "NEWEST";
}) => {
   return useInfiniteQuery({
      queryKey: [{ page: options.handle }, "posts", options.sortBy],
      queryFn: ({
         /* { id: string, postedAt: string } */
         pageParam,
      }) => {
         console.log("here");
         return getPostsAction({
            ...options,
            lastPost: pageParam ?? null,
         });
      },
      getNextPageParam: (lastPage, pages) => {
         if (pages.length === 0) return null;
         const last = lastPage[lastPage.length - 1];
         if (last) {
            return { id: last.id, postedAt: last.postedAt };
         }
         return undefined;
      },
   });
};