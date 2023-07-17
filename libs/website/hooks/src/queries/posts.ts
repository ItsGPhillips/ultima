"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "@website/api/server";
import { api } from "@website/api/client";
import { Post } from "@website/database";
import { Log } from "@website/utils";

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

const makePostVoteQueryKey = (postId: string) => (["post", postId, "votes"]);

export const usePostVotesQuery = (options: { postId: string }) => {
   return useQuery({
      queryKey: makePostVoteQueryKey(options.postId),
      queryFn: async () => {
         return { votes: 0 }
      }
   })
}

export const useUserPostVotesQuery = (options: { postId: string }) => {
   return useQuery({
      queryKey: makePostVoteQueryKey(options.postId),
      queryFn: async () => {
         return { isUpvote: true }
      }
   })
}

export const usePostVoteMutation = (options: { postId: string}) => {
   const client = useQueryClient();
   const queryKey = makePostVoteQueryKey(options.postId);

   return useMutation({
      mutationFn: async (data: { isUpvote: boolean }) => {
         await api
            .post
            .upsertPostVoteAction
            .mutate({
               postId: options.postId,
               isUpvote: data.isUpvote
            });
      },
      onMutate: async () => {
         await client.cancelQueries({ queryKey });
         const prev = client.getQueryData<{ isUpvote: true }>(queryKey, { exact: true });
         client.setQueryData(
            queryKey, 
            () => (
               prev === undefined 
                  ? undefined 
                  : { isUpvote: !prev.isUpvote } 
            )
         );

         return { prev }
      },
      onError: (_err, _new, context) => {
         client.setQueryData(queryKey, context?.prev);
      },
      onSettled: () => {
         client.invalidateQueries({ queryKey })
      }
   })
}