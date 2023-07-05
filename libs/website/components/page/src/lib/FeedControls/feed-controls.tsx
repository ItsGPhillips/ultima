import { cn } from "@website/utils";
import { auth } from "@website/lucia";

import { SubscribeButton } from "../SubscribeButton";
import { CreatePostButton } from "../CreatePostButton";
import { cookies } from "next/headers";
import { Focus } from "@website/components/shared";
import { getIsSubscribed } from "@website/actions";
import { CreatePostDialog } from "../CreatePostDialog";

export const FeedControls = async (props: { handle: string }) => {
   const authRequest = auth.handleRequest({ cookies });
   const { user } = await authRequest.validateUser();

   let isSubscribed = false;
   if (user) {
      isSubscribed = await getIsSubscribed(props.handle);
   }

   return (
      <div
         id="feed-controls"
         className={cn(
            "pl-2 pr-2 md:pl-10",
            "sticky top-[var(--header-height)] isolate z-[450] flex h-14 items-center bg-zinc-900 py-2"
         )}
      >
         <Focus.FocusScope>
            <CreatePostButton handle={props.handle}>
               <CreatePostDialog handle={props.handle} />
            </CreatePostButton>

            {!!user?.id && (
               <SubscribeButton
                  handle={props.handle}
                  initialData={isSubscribed}
               />
            )}
         </Focus.FocusScope>
      </div>
   );
};
