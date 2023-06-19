import { cn } from "~/utils/cn";
import { LayoutContext } from "./types";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { PropsWithChildren } from "react";
import { PageBanner } from "~/components/PageBanner";

export const createLayout = async (ctx: LayoutContext) => {
   return (
      <>
         <PageBanner title={ctx.params.slug} />
         <div className="group relative flex flex-row items-stretch justify-center">
            <div
               className={cn(
                  "sticky hidden tmd:block",
                  "top-[var(--header-height)] h-full"
               )}
            >
               {ctx.pageinfo}
            </div>
            <FeedContainer>
               {ctx.children}
            </FeedContainer>
            <div
               className={cn(
                  "sticky hidden txl:block",
                  "top-[var(--header-height)] h-full shrink"
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
            "basis-full": ua.device.type === "mobile",
            [tabletClasses]: ua.device.type === "tablet",
            "max-w-2xl shrink basis-full md:basis-1/2":
               ua.device.type === undefined,
         })}
      >
         {props.children}
      </div>
   );
};