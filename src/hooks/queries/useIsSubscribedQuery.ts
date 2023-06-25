import { useQuery } from "@tanstack/react-query";
import { getIsSubscribed } from "~/server/actions/subscription";
import { USER_SUBSCRIPTION } from "../queryKeys";

export const useIsSubscribedQuery = (data: {
   initialData: boolean;
   handle: string;
}) =>
   useQuery({
      queryKey: [USER_SUBSCRIPTION, { handle: data.handle }],
      queryFn: async () => {
         return await getIsSubscribed(data.handle);
      },
      initialData: data.initialData,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
   });
