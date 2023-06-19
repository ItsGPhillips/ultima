import { cn } from "~/utils/cn";
import { SubscribeButton } from "./SubscribeButton";
import { CreatePostButton } from "./CreatePostButton";
import { auth } from "~/server/lucia";
import { cookies } from "next/headers";

export const PageControls = async (props: { groupId: string }) => {
   const authRequest = auth.handleRequest({ cookies });
   const { user } = await authRequest.validateUser();

   return (
      <div
         id="feed-controls"
         className={cn(
            "pl-2 pr-2 md:pl-14",
            "sticky top-[var(--header-height)] isolate z-[450] flex h-14 items-center bg-zinc-900 py-2"
         )}
      >
         <CreatePostButton groupId={props.groupId} userId={user?.id} />
         {!!user?.id && <SubscribeButton groupId={props.groupId} />}
      </div>
   );
};
