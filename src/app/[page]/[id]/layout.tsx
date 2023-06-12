import { cn } from "~/utils/cn";
import { LAYOUT_CTX_SCHEMA } from "./types";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { PropsWithChildren } from "react";
import { PageBanner } from "~/components/PageBanner";

export default async function Layout(ctx: unknown) {
   const { params, children, pageinfo, sidebar } = LAYOUT_CTX_SCHEMA.parse(ctx);

   const ua = userAgent({ headers: headers() });
   const isTouchDevice = /mobile|tablet/.test(ua.device.type ?? "");
   const isMobileDevice = ua.device.type === "mobile";

   return (
      <>
         <PageBanner title={params.id} />
         <div
            className="group relative flex flex-row items-stretch justify-center"
            data-touch-device={isTouchDevice}
            data-device-type={ua.device.type}
         >
            <div
               className={cn(
                  "hidden tmd:block",
                  "sticky top-[var(--header-height)] h-full"
               )}
            >
               {pageinfo}
            </div>
            <FeedContainer>{children}</FeedContainer>
            <div
               className={cn(
                  "sticky hidden txl:block",
                  "top-[var(--header-height)] h-[500px] shrink"
               )}
            >
               {sidebar}
            </div>
         </div>
      </>
   );
}

const FeedContainer = (props: PropsWithChildren) => {
   const ua = userAgent({ headers: headers() });
   return (
      <div
         className={cn("txl:max-w-[50%]", {
            "basis-full": ua.device.type === "mobile",
            "flex flex-col": ua.device.type === "tablet",
            _: ua.device.type === undefined,
         })}
      >
         {props.children}
      </div>
   );
};
