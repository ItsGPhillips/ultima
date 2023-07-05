'use server';

import { desc, eq, sql } from 'drizzle-orm';
import { schema, db, type Post } from '@website/database';
import { cuid, Log } from '@website/utils';
import superjson from 'superjson';
import { JSONContent } from '@tiptap/react';

import { withAuth } from './utils';

const POSTS_PER_REQUEST_LIMIT = 5;

// export const hasMorePostsAction = async (options: {
//    handle: string;
//    sortBy: "NEWEST";
//    lastPost: {
//       id: string;
//       postedAt: string;
//    } | null;
// }) => {
//    if (!options.lastPost) {
//       const [row] = await db
//          .select({ id: schema.post.id })
//          .from(schema.post)
//          .where(sql`${schema.post.handle} = ${options.handle}`)
//          .orderBy(desc(schema.post.postedAt))
//          .limit(1);

//       return row !== undefined;
//    }

//    console.log("got herer", options.lastPost)

//    const [row] = await db
//       .select({ id: schema.post.id })
//       .from(schema.post)
//       .where(
//          sql`${schema.post.handle} = ${options.handle} AND
//          ${schema.post.postedAt} < ${options.lastPost.postedAt}::TIMESTAMP`
//       )
//       .orderBy(desc(schema.post.postedAt))
//       .limit(1);

//    console.log("row", row)

//    return row !== undefined;
// };

export const getPostsAction = async (options: {
  handle: string;
  sortBy: 'NEWEST';
  lastPost: {
    id: string;
    postedAt: string;
  } | null;
}) => {
  // Get the first posts.
  if (!options.lastPost) {
    return await db
      .select()
      .from(schema.post)
      .where(sql`${schema.post.handle} = ${options.handle}`)
      .orderBy(desc(schema.post.postedAt))
      .limit(POSTS_PER_REQUEST_LIMIT);
  }

  return await db
    .select()
    .from(schema.post)
    .where(
      sql`${schema.post.handle} = ${options.handle} AND 
         ${schema.post.postedAt} < ${options.lastPost.postedAt}::TIMESTAMP`
    )
    .orderBy(desc(schema.post.postedAt))
    .limit(POSTS_PER_REQUEST_LIMIT);
};

export const createPostAction = withAuth(
  async (
    user,
    data: Omit<Post<'insert'>, 'id' | 'posterHandle' | 'body'> & { body: any }
  ) => {
    const [currentUser] = await db
      .select({
        handle: schema.page.handle,
      })
      .from(schema.page)
      .where(eq(schema.page.primaryProfileId, user.id))
      .limit(1);

    if (!currentUser) throw new Error('INVALID_DATABASE_STATE');

    console.log('create schema.post action', data?.images);

    const payload = {
      id: cuid(),
      handle: data.handle,
      images: data.images,
      posterHandle: currentUser.handle,
      body: superjson.deserialize<JSONContent>(data.body),
    } satisfies Post<'insert'>;

    try {
      await db.insert(schema.post).values(payload).returning();
    } catch (e) {
      Log.error(e, 'createPostAction');
    }
  }
);
