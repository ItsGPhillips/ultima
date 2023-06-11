import { cn } from "~/utils/cn";
import { LayoutContext } from "./types";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import Sidebar from "./@sidebar/page";
import { PropsWithChildren } from "react";

export default async function Layout(ctx: LayoutContext) {
   const ua = userAgent({ headers: headers() });
   const isTouchDevice = /mobile|tablet/.test(ua.device.type ?? "");

   return (
      <div className="">
         <div className="w-full border-2 h-60 shrink-0 sticky"></div>
         <div
            className="group relative flex"
            data-touch-device={isTouchDevice}
            data-device-type={ua.device.type}
         >
            <FeedContainer>{ctx.children}</FeedContainer>
            {ua.device.type === "mobile" ? null : <Sidebar />}
         </div>
      </div>
   );
}

const FeedContainer = (props: PropsWithChildren) => {
   const ua = userAgent({ headers: headers() });
   const tabletStyles = cn(
      "flex flex-col",
      "basis-full basis-2/3 txl:basis-3/4 grow-0 shrink-0"
   );
   return (
      <div
         className={cn("h-[2000px] max-w-full", {
            "basis-full": ua.device.type === "mobile",
            [`${tabletStyles}`]: ua.device.type === "tablet",
            "a basis-full": ua.device.type === "desktop",
         })}
      >
         {props.children}
      </div>
   );
};
