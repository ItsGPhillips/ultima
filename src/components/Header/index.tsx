import { currentUser } from "@clerk/nextjs/server";
import { UserAvatar } from "../shared/UserAvatar";
import { HideOnScroll } from "./HideOnScroll";

export const Header = async () => {
   const user = await currentUser();
   if (user) {
      const name = `${user.firstName} ${user.lastName}`;
      return (
         <HideOnScroll className="fixed top-0 flex h-[var(--header-height)] w-full items-center bg-zinc-700/50">
            <header className="h-full w-[inherit] mx-4">
               <div className="float-right flex h-full items-center">
                  <span className="mr-2 hidden sm:block">{name}</span>
                  <UserAvatar name={name} imageUrl={user.imageUrl} />
               </div>
            </header>
         </HideOnScroll>
      );
   }
   return (
      <header className="h-[var(--header-height)] w-full bg-green-600"></header>
   );
};
