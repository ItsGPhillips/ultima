"use client";

import * as RadixAvatar from "@radix-ui/react-avatar";
import { cn } from "~/utils/cn";

export type UserAvatarProps = {
   imageUrl?: string;
   name: string;
   className?: string;
};

export const UserAvatar: React.FC<UserAvatarProps> = (props) => {
   const [c0, c1, c2] = props.name.split(" ").map((name) => name[0]);
   return (
      <RadixAvatar.Root
         className={cn(
            "flex h-10 w-10 flex-shrink-0 flex-row items-center gap-4 self-center overflow-hidden rounded-md",
            props.className
         )}
         aria-label="User Avatar"
      >
         <RadixAvatar.Image
            src={props.imageUrl}
            alt="Colm Tuite"
            className="h-full w-full object-cover"
         />
         <RadixAvatar.Fallback
            className="flex h-full w-full items-center justify-center rounded-full font-bold text-black"
            delayMs={600}
            style={{
               fontSize: "0.8em",
               backgroundColor: `hsl(${Math.random() * 100}, 100%, 80%)`,
            }}
         >
            {c0}
            {c1 ?? null}
            {c2 ?? null}
         </RadixAvatar.Fallback>
      </RadixAvatar.Root>
   );
};
