import { createLayout } from "../../createLayout";
import { LAYOUT_CTX_SCHEMA } from "../../types";

const Layout = async (ctx: unknown) => {
   return createLayout(LAYOUT_CTX_SCHEMA.parse(ctx));
}

export default Layout;