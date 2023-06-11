import { PropsWithChildren } from "react";
import { PageContext } from "./types";
import { HeaderScrollHandle } from "~/components/Header/HideOnScroll";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { Post } from "~/components/Post";

import { getPathSegments } from "~/utils/server/getPathSegments";



const Page = ({ params }: PageContext) => {
   const ua = userAgent({ headers: headers() });
   const segments = getPathSegments();
   return (
      <div>
         {ua.device.type === "mobile" && <HeaderScrollHandle />}
         <div className="h-10 border-2 sticky top-[var(--header-height)]"></div>
         {Array(100)
            .fill(null)
            .map((_, idx) => {
               return <Post key={idx}></Post>;
            })}
      </div>
   );
};

export default Page;
