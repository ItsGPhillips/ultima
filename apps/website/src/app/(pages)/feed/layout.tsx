import { createLayout } from "../createLayout";
import { LAYOUT_CTX_SCHEMA } from "../types";
import Image from "next/image";

import banner from "./../../../../public/DALL-E-banner-art.png";

const Layout = async (ctx: unknown) => {
   const { children, pageinfo, sidebar } = LAYOUT_CTX_SCHEMA.parse(ctx);
   return createLayout({
      children,
      pageinfo,
      sidebar,
      banner: (
         <div className="relative flex h-full items-center justify-center bg-black/10 text-xs">
            <Image
               src={banner}
               alt={"Banner Image"}
               fill
               className="select-none object-cover pointer-events-none"
               draggable="false"
               priority
            />
         </div>
      ),
   });
};

export default Layout;
