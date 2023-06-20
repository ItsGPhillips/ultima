"use client";

import { mergeRefs } from "@react-aria/utils";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { forwardRef, useRef } from "react";
import { AriaButtonProps, mergeProps, useButton } from "react-aria";
import { cn } from "~/utils/cn";
import { trpc } from "~/utils/trpc";
import { useToggleSubscriptionMutation } from "~/hooks/mutations/useToggleSubscriptionMutation";
import { useIsSubscribedQuery } from "~/hooks/queries/useIsSubscribedQuery";

export type SubscribeButtonProps = AriaButtonProps<"button"> & {
   groupId: string;
   isSubscribed: boolean;
};

/**
 * hook that wraps an optimistaically updated
 * trpc query.
 */
const useSubscribeButtonQuery = (data: {
   initialData: boolean;
   pageId: string;
}) => {
   const { data: isSubscribed, isFetching } = useIsSubscribedQuery(data);
   const { mutate: toggleSubscription } = useToggleSubscriptionMutation(
      data.pageId
   );
   return { isSubscribed, isFetching, toggleSubscription };
};

export const Button = forwardRef<HTMLButtonElement, SubscribeButtonProps>(
   (props, fref) => {
      const { isSubscribed, toggleSubscription } = useSubscribeButtonQuery({
         initialData: props.isSubscribed,
         pageId: props.groupId,
      });

      const ref = useRef<HTMLButtonElement>(null);
      const { buttonProps } = useButton(
         mergeProps(props, {
            onPress() {
               toggleSubscription();
            },
         }),
         ref
      );

      const className = isSubscribed
         ? cn(
              "ml-auto border-2 px-4 py-1 font-bold text-white antialiased rounded-full",
              "border-green-500 bg-green-500/40 outline-none transistion-all"
           )
         : cn(
              "ml-auto border-2 px-4 py-1 font-bold text-white antialiased rounded-full",
              "border-blue-500 bg-blue-500/40 outline-none transistion-all"
           );

      return (
         <button
            ref={mergeRefs(ref, fref)}
            {...buttonProps}
            className={cn("flex w-32 items-center justify-center", className)}
         >
            {isSubscribed ? "Subscribed" : "Subscribe"}
         </button>
      );
   }
);
