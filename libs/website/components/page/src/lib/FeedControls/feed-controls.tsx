import { Log, cn } from "@website/utils";
import { auth } from "@website/lucia";

import { SubscribeButton } from "../SubscribeButton";
import { CreatePostButton } from "../CreatePostButton";
import { cookies } from "next/headers";
import { Focus } from "@website/components/shared";
import { getIsSubscribed } from "@website/actions";
import { CreatePostDialog } from "../CreatePostDialog";
import { Page, db } from "@website/database";
import { cache } from "react";

const getPageForUserId = cache(async (userId: string) => {
   return await db.query.page.findFirst({
      where: (page, { eq }) => eq(page.primaryProfileId, userId),
   });
});

export const FeedControls = async (props: { handle: string }) => {
   const authRequest = auth.handleRequest({ cookies });
   const { user } = await authRequest.validateUser();

   let isSubscribed = false;
   let page: Page | undefined = undefined;
   if (user) {
      const data = await Promise.all([
         getPageForUserId(user.id),
         getIsSubscribed(props.handle),
      ]);
      page = data[0];
      isSubscribed = data[1];
   }

   const showSubscribleButton = !!user?.id && page?.handle !== props.handle;

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

            {showSubscribleButton && (
               <SubscribeButton
                  handle={props.handle}
                  initialData={isSubscribed}
               />
            )}
         </Focus.FocusScope>
      </div>
   );
};
