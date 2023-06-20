import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSubscription } from "~/server/actions";
import { USER_SUBSCRIPTION } from "../queryKeys";

export const useToggleSubscriptionMutation = (pageId: string) => {
   const queryKey = [USER_SUBSCRIPTION, { pageId }];
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
         onError: (_err, _input, ctx) => {
            client.setQueryData(queryKey, ctx?.prev?.data);
         },
         onSettled: () => {
            client.invalidateQueries(queryKey);
         },
      }
   );
};
