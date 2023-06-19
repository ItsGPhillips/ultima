import React from "react";
import { MdCopyright } from "react-icons/md";
import { BiCake } from "react-icons/bi";
import { SeperatorDot } from "~/components/shared/SeperatorDot";
import { UserAvatar } from "~/components/shared/UserAvatar";
import { cn } from "~/utils/cn";
import { Seperator } from "~/components/shared/Seperator";
import { Badge } from "~/components/Badge";
import { db } from "~/server/database";

const Page = async (ctx: any) => {
   const group = await db.query.group.findFirst({
      where: (group, { eq }) => eq(group.id, ctx.params.slug),
      with: {
         badges: true,
      },
   });

   if (!group) {
      return <div>{ctx.params.id} not found</div>;
   }

   const date = new Date(group.createdAt)
      .toDateString()
      .split(" ")
      .slice(1)
      .join(" ");

   return ( 
      <div
         className={cn(
            "float-right h-[var(--available-area-height)] border-r-[1px] border-white/10 py-2 text-white",
            "flex w-64 flex-col justify-start"
         )}
      >
         <div className="flex w-full basis-12 items-end pl-2">
            <h1 className="truncate whitespace-pre-line text-3xl font-bold">
               {group.name}
            </h1>
         </div>
         <span className="text-link pl-2 text-sm font-light italic text-white/75">
            @{group.id}
         </span>
         <div className="ml-2 mt-2 flex w-full flex-wrap gap-1">
            {group.badges.map((badge) => {
               return (
                  <Badge
                     variant={badge.name}
                     ignoreIcon={badge.name === "admin"}
                  />
               );
            })}
         </div>
         <div className="ml-2 mt-2 flex items-center gap-2 text-xs">
            <span className="text-white/75">52.4K Subscribers</span>
            <SeperatorDot />
            <span className="text-white/75">140 Online</span>
         </div>
         <Seperator className="my-2" />
         {/** created at */}
         <div className="ml-2 flex items-center gap-2 text-xs">
            <BiCake color="rgba(255,255,255,0.75)" className="h-4 w-4" />
            <span className="text-white/75">{date}</span>
         </div>

         <span className="mt-2 border-b-[1px] border-white/10" />
         <div className="ml-2 mt-2 pr-2">
            <h3 className="mb-1 font-bold text-white/90">Description</h3>
            <p className="text-sm text-white/75">{group.description}</p>
         </div>
         <Seperator className="my-2" />
         <div className="flex flex-1 grow flex-col">
            <h3 className="mb-1 ml-2 font-bold text-white/90">Moderators</h3>
            {Array(10)
               .fill(null)
               .map((_, idx) => {
                  return (
                     <React.Fragment key={idx}>
                        <div
                           className={cn(
                              "relative flex items-center gap-2 overflow-hidden rounded-md p-1 hover:bg-white/10",
                              "[&>span]:hover:text-green-400"
                           )}
                           suppressHydrationWarning
                        >
                           <UserAvatar
                              name="Test Name"
                              className="float-left block h-6 w-6 shrink-0 text-sm"
                           />
                           <span className="testthing text-link flex h-full max-w-[80%] items-center truncate text-xs text-green-400/70">
                              u/random-username
                           </span>
                        </div>
                     </React.Fragment>
                  );
               })}
         </div>
         <Seperator className="my-2" />
         <div className="ml-2 mt-auto flex items-center gap-2 pb-2 text-xs">
            <MdCopyright color="rgba(255,255,255,0.75)" className="h-4 w-4" />
            <span className="text-white/75">George Phillips 2023</span>
         </div>
      </div>
   );
};

export default Page;