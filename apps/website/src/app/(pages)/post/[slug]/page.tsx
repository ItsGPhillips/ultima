import { HeaderScrollHandle } from '@website/components/Header/HideOnScroll';
import { userAgent } from 'next/server';
import { headers } from 'next/headers';
import { PageControls } from '@website/components/PageControls';
import { db } from '@website/server/database/index';
import { PageFeed } from '@website/components/PageFeed';

const Page = async (ctx: any) => {
  const ua = userAgent({ headers: headers() });

  const posts = await db.query.post.findMany({
    where: (post, { eq }) => eq(post.handle, ctx.params.slug),
    with: {
      page: true,
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
      {ua.device.type === 'mobile' && <HeaderScrollHandle />}
      <PageControls handle={ctx.params.slug} />
      <PageFeed handle={ctx.params.slug} />
    </>
  );
};

export default Page;
