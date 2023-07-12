import { createLayout } from "../createLayout";
import { LAYOUT_CTX_SCHEMA } from "../types";

const Layout = async (ctx: unknown) => {
   const { children, pageinfo, sidebar } = LAYOUT_CTX_SCHEMA.parse(ctx);
   return createLayout({
      children,
      pageinfo,
      sidebar,
      banner: (
         <div className="flex items-center justify-center bg-black/10 text-xs h-full">
            FEED BANNER
         </div>
      ),
   });
};

export default Layout;
