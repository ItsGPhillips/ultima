import { useQuery } from "@tanstack/react-query";
import { getIsSubscribed } from "~/server/actions";

export const useIsSubscribedQuery = (data: {
   initialData: boolean;
   pageId: string;
}) =>
   useQuery({
      queryKey: ["user", "subscription", { pageId: data.pageId }],
      queryFn: async () => {
         return await getIsSubscribed(data.pageId);
      },
      initialData: data.initialData,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
   });
