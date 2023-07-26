"use client";

import {
   useInfiniteQuery,
   useMutation,
   useQuery,
   useQueryClient,
} from "@tanstack/react-query";
import { RouterInputs } from "@website/api/server";
import { api } from "@website/api/client";
import { Post } from "@website/database";

export const usePostQuery = (options: { postId: string }) => {
   return useQuery({
      queryKey: ["post", options.postId],
      queryFn: async () => {
         return await api.post.getPost.query(options);
      },
   });
};
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
      queryKey: [
         { feed: options.homeFeed ?? false, handle: options.handle },
         "posts",
         options.filter,
      ],
      queryFn: async ({ pageParam = { lastId: undefined } }) => {
         return await api.post.getPosts.query({
            ...options,
            lastId: pageParam.lastId,
            handle: options.handle ?? "",
            homeFeed: options.homeFeed ?? false,
         });
      },
      getNextPageParam,
   });
};

const makePostVoteQueryKey = (postId: string, ...extra: string[]) => [
   "post",
   postId,
   "votes",
   ...extra,
];

export const usePostVoteCountQuery = (options: { postId: string }) => {
   return useQuery({
      queryKey: makePostVoteQueryKey(options.postId, "count"),
      queryFn: async () => {
         return await api.post.getVotes.query(options);
      },
   });
};

export const useUserPostVotesQuery = (options: { postId: string }) => {
   return useQuery({
      queryKey: makePostVoteQueryKey(options.postId),
      queryFn: async () => {
         return api.post.getUserVote.query({ postId: options.postId });
      },
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
   });
};

export const usePostVoteMutation = (options: { postId: string }) => {
   const client = useQueryClient();
   const queryKey = makePostVoteQueryKey(options.postId);

   return useMutation({
      mutationFn: async (data: { isUpvote: boolean | null }) => {
         await api.post.upsertPostVoteAction.mutate({
            postId: options.postId,
            isUpvote: data.isUpvote,
         });
      },
      onMutate: async (input) => {
         console.log(input);
         await client.cancelQueries({ queryKey });
         const prev = client.getQueryData<{ isUpvote: boolean | null }>(
            queryKey,
            {
               exact: true,
            }
         );

         client.setQueryData(queryKey, () => input);

         return { prev };
      },
      onError: (_err, _new, context) => {
         client.setQueryData(queryKey, context?.prev);
      },
      onSettled: () => {
         client.invalidateQueries({ queryKey });
         client.invalidateQueries({
            queryKey: makePostVoteQueryKey(options.postId, "count"),
         });
      },
   });
};

export const useCommentsQuery = (options: { postId: string; parentId: number | null }) => {
   return useQuery({
      queryKey: [
         "post",
         options.postId,
         "comments",
         { parentId: options.parentId },
      ],
      queryFn: async () => {
         return await api.post.getComments.query(options);
      }
   });
};
