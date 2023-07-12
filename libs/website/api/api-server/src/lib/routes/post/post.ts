import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { db, schema } from "@website/database";
import { asc, eq, sql } from "drizzle-orm";

import { post } from "libs/website/database/src/schema";
import { Log } from "@website/utils";

const GET_MANY_SCHEMA = z.object({
   filter: z.enum(["NEWEST"]),
   lastId: z.string().nonempty().optional(),
   limit: z.number().min(1).default(5),
});

export const postsRouter = router({
   getFeed: publicProcedure.input(GET_MANY_SCHEMA).query(async ({ input }) => {
      let query = db
         .select({ postedAt: schema.post.postedAt })
         .from(schema.post);

      if (input.lastId) {
         query = query.where(eq(schema.post.id, input.lastId));
      }

      const [data] = await query.limit(1);

      if (!data) {
         return [];
      }

      switch (input.filter) {
         case "NEWEST": {
            try {
               const filter = !!input.lastId
                  ? sql`${schema.post.postedAt} > ${data.postedAt}::TIMESTAMP`
                  : sql`${schema.post.postedAt} >= ${data.postedAt}::TIMESTAMP`;

               return await db
                  .select()
                  .from(post)
                  .where(filter)
                  .orderBy(asc(schema.post.postedAt))
                  .limit(input.limit);
            } catch (e) {
               console.log(e);
               return [];
            }
         }
         default:
            throw "unimplimented";
      }
   }),
});
