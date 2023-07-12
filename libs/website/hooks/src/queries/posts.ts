"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostsAction } from "@website/actions";
import { RouterInputs } from "@website/api/server";
import { api } from "@website/api/client";
import { Post } from "@website/database";

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
         return getPostsAction({
            ...options,
            lastPost: pageParam ?? null,
         });
      },
      getNextPageParam: (lastPage, pages) => {
         const last = lastPage[lastPage.length - 1];
         if (last) {
            return { id: last.id, postedAt: last.postedAt };
         }
         return undefined;
      },
   });
};

type Options = RouterInputs["post"]["getFeed"];

export const useFeedPostsQuery = (options: { filter: Options["filter"] }) => {
   return useInfiniteQuery<Post[]>({
      queryKey: [{ feed: true }, "posts", options.filter],
      queryFn: async ({ pageParam = { lastId: undefined } }) => {
         const data = await api.post.getFeed.query({
            filter: options.filter,
            limit: 5,
            lastId: pageParam.lastId,
         });
         return data;
      },
      getNextPageParam: (lastPage, pages) => {
         if (pages.length === 0) return { lastId: undefined };
         const last = lastPage[lastPage.length - 1];
         if (last) {
            return { lastId: last.id };
         }
         return undefined;
      },
   });
};
