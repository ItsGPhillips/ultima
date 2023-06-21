import { cn } from "~/utils/cn";
import { SubscribeButton } from "./SubscribeButton";
import { CreatePostButton } from "./CreatePostButton";
import { auth } from "~/server/lucia";
import { cookies } from "next/headers";

export const PageControls = async (props: { handle: string }) => {
   const authRequest = auth.handleRequest({ cookies });
   const { user } = await authRequest.validateUser();

   return (
      <div
         id="feed-controls"
         className={cn(
            "pl-2 pr-2 md:pl-10",
            "sticky top-[var(--header-height)] isolate z-[450] flex h-14 items-center bg-zinc-900 py-2"
         )}
      >
         <CreatePostButton handle={props.handle} />
         {!!user?.id && <SubscribeButton handle={props.handle} />}
      </div>
   );
};
