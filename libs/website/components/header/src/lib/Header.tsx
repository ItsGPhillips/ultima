import { HideOnScroll } from "./HideOnScroll";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { cn } from "@website/utils";
import { SignInButton } from "./SignInButton";
import { currentUser } from "@website/actions";
import { db } from "@website/database";
import { RemoveScroll } from "react-remove-scroll";
import { UserAvatar } from "./UserAvatar";
import { CreateAccountButton } from "./create-account-button";

export const HeaderOld = async () => {
   const user = await currentUser();

   // @ts-ignore
   const ua = userAgent({ headers: headers() });
   const isTouchDevice = /mobile|tablet/.test(ua.device.type ?? "");

   let content;
   if (user) {
      const profile = await db.query.profile.findFirst({
         where: (profile, { eq }) => eq(profile.id, user.id),
         with: {
            page: {
               columns: {
                  handle: true,
               },
            },
         },
      });

      if (!profile) throw new Error("INVALID_DATABASE_STATE");

      const name = `${profile.firstName} ${profile.firstName}`;
      content = (
         <header
            className={cn(
               "relative mx-4 flex h-full w-[inherit]",
               RemoveScroll.classNames.zeroRight
            )}
         >
            <div className="flex w-60 items-center justify-center border-2">
               LOGO
            </div>
            {/* <div className="absolute flex items-center justify-stretch h-full left-1/2 -translate-x-1/2 w-[var(--feed-width)]">
               <input type="text" className="w-full p-2 rounded text-black my-2"/>
            </div> */}
            <div
               className="ml-auto flex h-full items-center gap-4"
               suppressHydrationWarning
            >
               <span className="mr-2 hidden sm:block">
                  {profile.page.handle}
               </span>
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

const getProfile = async () => {
   const user = await currentUser();
   if (user) {
      const profile = await db.query.profile.findFirst({
         where: (profile, { eq }) => eq(profile.id, user.id),
         with: {
            page: {
               columns: {
                  handle: true,
               },
            },
         },
      });
      if (!profile) return null;
      return profile;
   }
   return null;
};

const HeaderImpl = async () => {
   const profile = await getProfile();
   return (
      <header
         className={cn(
            "relative flex h-full w-full",
            RemoveScroll.classNames.fullWidth
         )}
      >
         <div className="ml-auto mr-4 flex items-center">
            {!!profile && (
               <UserAvatar profile={profile} handle={profile.page.handle} />
            )}
            {!profile && (
               <div className="flex flex-nowrap items-center gap-2">
                  <SignInButton />
                  <CreateAccountButton />
               </div>
            )}
         </div>
      </header>
   );
};

export const Header = () => {
   const ua = userAgent({ headers: headers() });
   const isTouchDevice = /mobile|tablet/.test(ua.device.type ?? "");

   const className =
      "fixed z-[600] top-0 flex h-[var(--header-height)] w-full items-center bg-zinc-900";

   return isTouchDevice ? (
      <HideOnScroll className={className}>{HeaderImpl()}</HideOnScroll>
   ) : (
      <div className={className}>{HeaderImpl()}</div>
   );
};
