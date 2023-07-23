import { z } from "zod";
import { procedure, router } from "../../trpc";
import { db, schema } from "@website/database";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { Log } from "@website/utils";

export const profileRouter = router({
   getAccentColor: procedure
      .input(
         z.object({
            handle: z.string(),
         })
      )
      .query(async ({ input }) => {
         try {
            const [data] = await db
               .select({
                  accentColor: schema.page.accentColor,
               })
               .from(schema.page)
               .where(eq(schema.page.handle, input.handle))
               .limit(1);

            if (!data) {
               throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }

            return data.accentColor ?? "#ffffff4d";
         } catch (e) {
            Log.error(e);
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
         }
      }),
});
