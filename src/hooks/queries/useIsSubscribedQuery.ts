import { useQuery } from "@tanstack/react-query";
import { getIsSubscribed } from "~/server/actions";
import { USER_SUBSCRIPTION } from "../queryKeys";

export const useIsSubscribedQuery = (data: {
   initialData: boolean;
   pageId: string;
}) =>
   useQuery({
      queryKey: [USER_SUBSCRIPTION, { pageId: data.pageId }],
      queryFn: async () => {
         return await getIsSubscribed(data.pageId);
      },
      initialData: data.initialData,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
   });
