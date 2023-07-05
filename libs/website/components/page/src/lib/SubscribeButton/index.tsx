"use client";

import { AriaButton } from "@website/components/shared";
import {
   useToggleSubscriptionMutation,
   useIsSubscribedQuery,
} from "@website/hooks";
import { cn } from "@website/utils";

export type SubscribeButtonProps = {
   handle: string;
   initialData: boolean;
};

/**
 * hook that wraps an optimistaically updated
 * trpc query.
 */
const useSubscribeButtonQuery = (data: SubscribeButtonProps) => {
   const { data: isSubscribed, isFetching } = useIsSubscribedQuery(data);
   const { mutate: toggleSubscription } = useToggleSubscriptionMutation(
      data.handle
   );
   return { isSubscribed, isFetching, toggleSubscription };
};

export const SubscribeButton = (props: SubscribeButtonProps) => {
   const { isSubscribed, toggleSubscription } = useSubscribeButtonQuery(props);

   const className = isSubscribed
      ? cn(
           "ml-auto border-2 px-4 py-1 font-bold text-white antialiased rounded-full",
           "border-green-500 bg-green-500/40 transistion-all"
        )
      : cn(
           "ml-auto border-2 px-4 py-1 font-bold text-white antialiased rounded-full",
           "border-blue-500 bg-blue-500/40 transistion-all"
        );

   return (
      <AriaButton
         onPress={() => {
            console.log("clicked");
            toggleSubscription();
         }}
         className={cn("flex w-32 items-center justify-center", className)}
      >
         {isSubscribed ? "Subscribed" : "Subscribe"}
      </AriaButton>
   );
};
