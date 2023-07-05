import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostsAction } from '@website/actions';

export const usePostsInfinateQuery = (options: {
  handle: string;
  sortBy: 'NEWEST';
}) => {
  return useInfiniteQuery({
    queryKey: [{ page: options.handle }, 'posts', options.sortBy],
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
      if (pages.length === 0) return null;
      const last = lastPage[lastPage.length - 1];
      if (last) {
        return { id: last.id, postedAt: last.postedAt };
      }
      return undefined;
    },
  });
};
