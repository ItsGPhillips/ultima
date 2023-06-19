import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSubscription } from "~/server/actions";

export const useToggleSubscriptionMutation = (pageId: string) => {
   const queryKey = ["user", "subscription", { pageId }];
   const client = useQueryClient();
   return useMutation(
      async () => {
         await toggleSubscription(pageId);
      },
      {
         onMutate: async () => {
            await client.cancelQueries({ queryKey });
            const prev = client.getQueryState(queryKey);
            client.setQueryData(queryKey, !prev?.data);
            return { prev };
         },
         onError: (_err, input, ctx) => {
            client.setQueryData(queryKey, ctx?.prev?.data);
         },
         onSettled: () => {
            client.invalidateQueries(queryKey);
         },
      }
   );
};
