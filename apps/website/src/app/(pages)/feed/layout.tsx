import { createLayout } from "../createLayout";
import { LAYOUT_CTX_SCHEMA } from "../types";

const Layout = async (ctx: unknown) => {
   const { children, pageinfo, sidebar } = LAYOUT_CTX_SCHEMA.parse(ctx);
   return createLayout({ children, pageinfo, sidebar, banner: null });
};

export default Layout;
