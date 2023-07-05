import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSubscription } from "@website/actions";
import { USER_SUBSCRIPTION } from "../queryKeys";

export const useToggleSubscriptionMutation = (handle: string) => {
   const queryKey = [USER_SUBSCRIPTION, { handle }];
   const client = useQueryClient();
   return useMutation(
      async () => {
         await toggleSubscription(handle);
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
