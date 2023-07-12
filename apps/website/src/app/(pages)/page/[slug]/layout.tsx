import { createLayout } from "../../createLayout";
import { LAYOUT_WITH_SLUG_CTX_SCHEMA } from "../../types";
import { Banner } from "./banner";

const Layout = async (ctx: unknown) => {
   const { params, children, pageinfo, sidebar } =
      LAYOUT_WITH_SLUG_CTX_SCHEMA.parse(ctx);
   return createLayout({
      banner: <Banner title={params.slug} />,
      children,
      pageinfo,
      sidebar,
   });
};

export default Layout;
