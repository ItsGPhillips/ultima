import { cn } from "@website/utils";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { PropsWithChildren } from "react";
import { PageBanner } from "./PageBanner";
import { LayoutContext } from "./types";

export const createLayout = async (ctx: LayoutContext) => {
   return (
      <>
         <PageBanner title={ctx.params.slug} />
         <div className="group relative flex flex-row items-stretch justify-center">
            <div
               className={cn(
                  "tmd:block sticky hidden overflow-hidden",
                  "top-[var(--header-height)] h-full flex-1 "
               )}
            >
               {ctx.pageinfo}
            </div>
            <FeedContainer>{ctx.children}</FeedContainer>
            <div
               className={cn(
                  "txl:block sticky hidden overflow-hidden",
                  "top-[var(--header-height)] h-full shrink flex-1"
               )}
            >
               {ctx.sidebar}
            </div>
         </div>
      </>
   );
};

const FeedContainer = (props: PropsWithChildren) => {
   const ua = userAgent({ headers: headers() });
   const tabletClasses = "flex flex-col tmd:basis-2/3"; 

   return (
      <div
         className={cn("", {
            "mx-1 basis-full": ua.device.type === "mobile",
            [tabletClasses]: ua.device.type === "tablet",
            "mx-1 max-w-2xl shrink basis-full md:ml-0 md:basis-2/3":
               ua.device.type === undefined,
         })}
      >
         {props.children}
      </div>
   );
};
