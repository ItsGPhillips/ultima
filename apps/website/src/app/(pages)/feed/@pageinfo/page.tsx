import React from "react";
import { MdCopyright } from "react-icons/md";
import { cn } from "@website/utils";

const Page = async (ctx: any) => {
   return (
      <div
         className={cn(
            "float-right h-[var(--available-area-height)] border-r-[1px] border-white/10 py-2 text-white",
            "flex w-64 flex-col justify-start"
         )}
      >
         <div className="ml-2 mt-auto flex items-center gap-2 pb-2 text-xs">
            <MdCopyright color="rgba(255,255,255,0.75)" className="h-4 w-4" />
            <span className="text-white/75">George Phillips 2023</span>
         </div>
      </div>
   );
};

export default Page;
