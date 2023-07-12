"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { RouterInputs } from "@website/api/server";
import { api } from "@website/api/client";
import { Post } from "@website/database";

const getNextPageParam = (lastPage: Post[], pages: Post[][]) => {
   if (pages.length === 0) return { lastId: undefined };
   const last = lastPage[lastPage.length - 1];
   if (last) {
      return { lastId: last.id };
   }
   return undefined;
};

export type UsePostsInfinateQueryOptions = {
   filter: RouterInputs["post"]["getPosts"]["filter"];
   limit?: number;
} & (
   | { homeFeed: true; handle?: string }
   | { homeFeed?: false; handle: string }
);

export const usePostsInfinateQuery = (
   options: UsePostsInfinateQueryOptions
) => {
   return useInfiniteQuery<Post[]>({
      queryKey: [{ feed: true }, "posts", options.filter],
      queryFn: async ({ pageParam = { lastId: undefined } }) => {
         return await api.post.getPosts.query({
            ...options,
            lastId: pageParam.lastId,
         });
      },
      getNextPageParam,
   });
};