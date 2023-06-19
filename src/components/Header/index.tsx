import { HideOnScroll } from "./HideOnScroll";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { cn } from "~/utils/cn";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { PROFILE_TABLE_SCHEMA } from "~/server/database/zod";
import { SignInButton } from "./SignInButton";

const getCurrentUser = async () => {
   const res = await fetch(`${getBaseUrl()}/api/user`, {
      method: "GET",
      headers: headers(),
   });
   const data = await res.json();
   console.log(data)
   return PROFILE_TABLE_SCHEMA.select.nullable().parse(data);
};

export const Header = async () => {
   const user = await getCurrentUser();

   const ua = userAgent({ headers: headers() });
   const isTouchDevice = /mobile|tablet/.test(ua.device.type ?? "");

   let content;
   if (user) {
      const name = `${user.firstName} ${user.lastName}`;
      content = (
         <header className={cn("mx-4 h-full w-[inherit]")}>
            <div
               className="float-right flex h-full items-center gap-4"
               suppressHydrationWarning
            >
               {name}
               <span className="mr-2 hidden sm:block">{user.handle}</span>
               {/* <UserAvatar name={name} imageUrl={user.imageUrl} /> */}
            </div>
         </header>
      );
   } else {
      content = (
         <header
            className={cn(
               "z-[600] h-[var(--header-height)] w-full bg-green-600"
            )}
         >
            <SignInButton />
         </header>
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
