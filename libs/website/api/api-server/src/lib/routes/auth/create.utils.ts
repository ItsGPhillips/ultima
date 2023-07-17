import { db, schema, type Auth } from "@website/database";
import { auth } from "@website/lucia";
import { Log } from "@website/utils";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const CREATE_ACCOUNT_SCHEMA = z.union([
   z.object({
      id: z.literal("email"),
      password: z.string(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string().nullable(),
      handle: z.string(),
   }),
   z.object({
      id: z.literal(""),
   }),
]);
export type CreateAccountSchema = z.infer<typeof CREATE_ACCOUNT_SCHEMA>;

export const createUserImpl = async (input: CreateAccountSchema) => {
   try {
      await db.execute(sql`BEGIN TRANSACTION`);

      let user: Auth.User;

      switch (input.id) {
         case "email": {
            // create auth user
            user = await auth.createUser({
               primaryKey: {
                  providerId: input.id,
                  password: input.password,
                  providerUserId: input.email,
               },
               attributes: {},
            });
            break;
         }
         default: {
            throw new Error("Impossible code path");
         }
      }

      // create associated profile
      await db.insert(schema.profile).values({
         id: user.id,
         firstName: input.firstName,
         lastName: input.lastName,
      });

      // create associated page
      await db.insert(schema.page).values({
         primaryProfileId: user.id,
         handle: input.handle,
         title: `${input.firstName} ${input.lastName}`,
         allowExternal: false,
         details:
            "This is a test page. This page was created automatically in the user.create endpoint " +
            "The more test I write here he better the test will be because it causes this to grow " +
            "and the text to wrap, but whatever la la la la la this is just random text anyway. Lorem ipsum hurts my eyes",
      });

      await db.execute(sql`COMMIT TRANSACTION`);
   } catch (e) {
      await db.execute(sql`ROLLBACK TRANSACTION`);
      Log.error(e, "trpc.auth.create");
   }
};
