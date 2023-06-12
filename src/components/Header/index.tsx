import { currentUser } from "@clerk/nextjs/server";
import { UserAvatar } from "../shared/UserAvatar";
import { HideOnScroll } from "./HideOnScroll";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { cn } from "~/utils/cn";

export const Header = async () => {
   const user = await currentUser();

   const ua = userAgent({ headers: headers() });
   const isTouchDevice = /mobile|tablet/.test(ua.device.type ?? "");

   console.log(ua.device.type, isTouchDevice);

   let content;
   if (user) {
      const name = `${user.firstName} ${user.lastName}`;
      content = (
         <header className={cn("mx-4 h-full w-[inherit]")}>
            <div className="float-right flex h-full items-center">
               <span className="mr-2 hidden sm:block">{name}</span>
               <UserAvatar name={name} imageUrl={user.imageUrl} />
            </div>
         </header>
      );
   } else {
      content = (
         <header
            className={cn(
               "z-[600] h-[var(--header-height)] w-full bg-green-600"
            )}
         ></header>
      );
   }
   const className =
      "fixed z-[600] top-0 flex h-[var(--header-height)] w-full items-center bg-zinc-900";

   return isTouchDevice ? (
      <HideOnScroll className={className}>{content}</HideOnScroll>
   ) : (
      <div className={className}>{content}</div>
   );
};
