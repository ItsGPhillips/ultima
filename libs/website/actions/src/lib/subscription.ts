'use server';

import { and, eq } from 'drizzle-orm';
import { schema, db } from '@website/database';

import { withAuth } from './utils';

export const getPageSubscription = async (
  handle: string,
  profileId: string
) => {
  const data = await db.query.subscription.findFirst({
    columns: {
      handle: false,
    },
    where: and(
      eq(schema.subscription.handle, handle),
      eq(schema.subscription.profileId, profileId)
    ),
  });
  return {
    subscription: data ?? null,
  };
};

export const getIsSubscribed = withAuth(
  async (user, handle: string): Promise<boolean> => {
    const data = await getPageSubscription(handle, user.id);
    return data.subscription !== null;
  }
);

export const toggleSubscription = withAuth(async (user, handle: string) => {
  const s = await getPageSubscription(handle, user.id);
  if (s.subscription) {
    await db
      .delete(schema.subscription)
      .where(
        and(
          eq(schema.subscription.handle, handle),
          eq(schema.subscription.profileId, user.id)
        )
      );
    return;
  }
  await db.insert(schema.subscription).values({
    handle,
    profileId: user.id,
  });
});
