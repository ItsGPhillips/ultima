import { HeaderScrollHandle } from "~/components/Header/HideOnScroll";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { Post } from "~/components/Post";

import { PageControls } from "~/components/PageControls";
import { db } from "~/server/database";
import { eq } from "drizzle-orm";
import { post } from "~/server/database/schema/user";

const Page = async (ctx: any) => {
   const ua = userAgent({ headers: headers() });
   const posts = await db.query.post.findMany({
      where: () => eq(post.profileHandle, ctx.params.slug),
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
         <div className="mt-1 flex flex-col gap-2">
            {posts.sort(comp).map((post) => {
               return <Post key={post.id} {...post} />;
            })}
         </div>
      </>
   );
};

export default Page;
