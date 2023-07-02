import { cn } from "~/utils/cn";
import { SubscribeButton } from "./SubscribeButton";
import { CreatePostButton } from "~/components/ui/CreatePostButton";
import { auth } from "~/server/lucia";
import { cookies } from "next/headers";
import { FocusScope } from "../shared/Focus";
import { getIsSubscribed } from "~/server/actions/subscription";
import { CreatePostDialog } from "~/components/ui/CreatePostDialog";

export const PageControls = async (props: { handle: string }) => {
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
         <FocusScope>
            <CreatePostButton handle={props.handle}>
               <CreatePostDialog handle={props.handle} />
            </CreatePostButton>

            {!!user?.id && (
               <SubscribeButton
                  handle={props.handle}
                  initialData={isSubscribed}
               />
            )}
         </FocusScope>
      </div>
   );
};
