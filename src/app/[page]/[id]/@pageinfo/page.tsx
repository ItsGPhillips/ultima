import Link from "next/link";
import React from "react";
import { FaCircle, FaLock } from "react-icons/fa";
import { RiVipDiamondFill } from "react-icons/ri";
import { MdShield, MdCopyright } from "react-icons/md";
import { BiCake } from "react-icons/bi";

import colors from "tailwindcss/colors";
import { SeperatorDot } from "~/components/SeperatorDot";
import { UserAvatar } from "~/components/shared/UserAvatar";
import { cn } from "~/utils/cn";
import { faker } from "@faker-js/faker";

const PageBadge = (props: {
   variant: string;
   ignoreLabel?: boolean;
   ignoreIcon?: boolean;
}) => {
   const elements: Record<
      string,
      {
         label: string;
         styles: string;
         icon: React.ReactElement<SVGSVGElement>;
      }
   > = {
      pro: {
         label: "Pro",
         styles: "border-purple-500 bg-purple-500/30",
         icon: (
            <RiVipDiamondFill
               color={colors.purple["200"]}
               className="aspect-square h-6 !stroke-purple-500"
            />
         ),
      },
      verified: {
         label: "Verified",
         styles: "border-blue-500 bg-blue-500/30",
         icon: (
            <FaCircle
               color={colors.blue["200"]}
               className="aspect-square h-6 scale-95 !stroke-blue-500"
            />
         ),
      },
      admin: {
         label: "Admin",
         styles: "border-red-500 bg-red-500/30",
         icon: (
            <FaLock
               color={colors.red["200"]}
               className="aspect-square h-6 scale-75 !stroke-red-500"
            />
         ),
      },
      moderator: {
         label: "Moderator",
         styles: "border-green-500 bg-green-500/30",
         icon: (
            <MdShield
               color={colors.green["200"]}
               className="aspect-square h-6 scale-95 !stroke-green-500"
            />
         ),
      },
   };

   return (
      <div
         className={cn(
            "whitespace-nowrap text-xs text-white",
            "flex h-6 w-min items-center gap-2 rounded-md border-2",
            props.ignoreLabel ? "w-6 p-1" : "px-2",
            elements[props.variant]?.styles
         )}
      >
         {!props.ignoreIcon && elements[props.variant]?.icon}
         {!props.ignoreLabel && elements[props.variant]?.label}
      </div>
   );
};

const Page = () => {
   return (
      <div
         className={cn(
            "float-right h-[var(--available-area-height)]  border-r-[1px] border-white/10 py-2 text-white",
            "flex w-64 flex-col justify-start"
         )}
      >
         <h1 className="ml-2 flex basis-12 place-items-baseline items-end align-bottom text-3xl font-bold">
            Page Name With Lots of Breaks
         </h1>
         <div className="ml-2 mt-2 flex w-full flex-wrap gap-1">
            <PageBadge variant="pro" />
            <PageBadge variant="verified" />
            <PageBadge variant="admin" ignoreIcon />
            <PageBadge variant="moderator" />
         </div>
         <div className="ml-2 mt-2 flex items-center gap-2 text-xs">
            <span className="text-white/75">52.4K Subscribers</span>
            <SeperatorDot />
            <span className="text-white/75">140 Online</span>
         </div>
         <span className="my-2 mt-2 border-b-[1px] border-white/10" />

         {/** created at */}
         <div className="ml-2 flex items-center gap-2 text-xs">
            <BiCake color="rgba(255,255,255,0.75)" className="h-4 w-4" />
            <span className="text-white/75">10th April 2023</span>
         </div>

         <span className="mt-2 border-b-[1px] border-white/10" />
         <div className="ml-2 mt-2 pr-2">
            <h3 className="mb-1 font-bold text-white/90">Description</h3>
            <p className="text-sm text-white/75">
               Lorem ipsum, dolor sit amet consectetur adipisicing elit.
               Ratione, nisi magnam? Architecto quae exercitationem eum minima
               rem quibusdam aut ex sapiente beatae, impedit et, itaque quos
               nostrum maxime! Eos, minima.
            </p>
         </div>
         <span className="my-2 border-b-[1px] border-white/10" />
         <div className="flex flex-1 grow flex-col">
            <h3 className="mb-1 ml-2 font-bold text-white/90">Moderators</h3>
            {Array(10)
               .fill(null)
               .map((_, idx) => {
                  return (
                     <React.Fragment key={idx}>
                        <Link
                           href="#"
                           className={cn(
                              "group-hover relative flex items-center gap-2 overflow-hidden rounded-md p-1 hover:bg-white/10",
                              "[&>span]:hover:text-green-400"
                           )}
                        >
                           <UserAvatar
                              name="Test Name"
                              className="float-left block h-6 w-6 shrink-0 text-sm"
                           />
                           <span className="testthing text-link flex h-full max-w-[80%] items-center truncate text-xs text-green-400/70">
                              u/{faker.person.firstName()}
                              {faker.person.zodiacSign()}
                           </span>
                        </Link>
                     </React.Fragment>
                  );
               })}
         </div>
         <span className="my-2 border-b-[1px] border-white/10" />
         <div className="ml-2 mt-auto flex items-center gap-2 text-xs">
            <MdCopyright color="rgba(255,255,255,0.75)" className="h-4 w-4" />
            <span className="text-white/75">George Phillips 2023</span>
         </div>
      </div>
   );
};

export default Page;
