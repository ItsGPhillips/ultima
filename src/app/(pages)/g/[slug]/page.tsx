import { HeaderScrollHandle } from "~/components/Header/HideOnScroll";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { Post } from "~/components/Post";

import { PageControls } from "~/components/PageControls";
import { db } from "~/server/database";
import { eq } from "drizzle-orm";
import { post } from "~/server/database/schema/user";
import { PageFeed } from "~/components/PageFeed";

const Page = async (ctx: any) => {
   const ua = userAgent({ headers: headers() });

   const posts = await db.query.post.findMany({
      where: () => eq(post.groupId, ctx.params.slug),
      with: {
         group: true,
      },
   });

   const comp = (a: (typeof posts)[number], b: (typeof posts)[number]) => {
      if (a.postedAt < b.postedAt) {
         return 1;
      }
      if (a.postedAt > b.postedAt) {
         return -1;
      }
      return 0;
   };

   return (
      <>
         {ua.device.type === "mobile" && <HeaderScrollHandle />}
         <PageControls groupId={ctx.params.slug} />
         <PageFeed pageId={ctx.params.slug}/>
      </>
   );
};

export default Page;
