"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { RouterInputs } from "@website/api/server";
import { api } from "@website/api/client";
import { Post } from "@website/database";

type Options = RouterInputs["post"]["getHomeFeed"];

const getNextPageParam = (lastPage: Post[], pages: Post[][]) => {
   if (pages.length === 0) return { lastId: undefined };
   const last = lastPage[lastPage.length - 1];
   if (last) {
      return { lastId: last.id };
   }
   return undefined;
};

export const usePostsInfinateQuery = (options: {
   filter: Options["filter"];
   handle: string;
}) => {
   return useInfiniteQuery({
      queryKey: [{ feed: true }, "posts", options.filter],
      queryFn: async ({ pageParam = { lastId: undefined } }) => {
         return await api.post.getPage.query({
            handle: options.handle,
            filter: options.filter,
            limit: 5,
            lastId: pageParam.lastId,
         });
      },
      getNextPageParam,
   });
};

export const useFeedPostsQuery = (options: { filter: Options["filter"] }) => {
   return useInfiniteQuery<Post[]>({
      queryKey: [{ feed: true }, "posts", options.filter],
      queryFn: async ({ pageParam = { lastId: undefined } }) => {
         const data = await api.post.getHomeFeed.query({
            filter: options.filter,
            limit: 5,
            lastId: pageParam.lastId,
         });
         return data;
      },
      getNextPageParam,
   });
};
