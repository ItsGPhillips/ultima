import { HeaderScrollHandle } from "~/components/Header/HideOnScroll";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { PageControls } from "~/components/PageControls";
import { db } from "~/server/database";
import { PageFeed } from "~/components/PageFeed";

const Page = async (ctx: any) => {

   const ua = userAgent({ headers: headers() });
   
   const posts = await db.query.post.findMany({
      where: (post, { eq }) => eq(post.handle, ctx.params.slug),
      with: {
         page: true,
      },
   });

   return (
      <>
         {ua.device.type === "mobile" && <HeaderScrollHandle />}
         <PageControls handle={ctx.params.slug} />
         <PageFeed handle={ctx.params.slug} />
      </>
   );
};

export default Page;
