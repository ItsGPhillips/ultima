import { sql } from "drizzle-orm";
import { User } from "lucia-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@website/database";
import { auth } from "@website/lucia";
import { Log } from "@website/utils";

const CREATE_ACCOUNT_SCHEMA = z.union([
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

export const createUser = async (req: NextRequest): Promise<Response> => {
   const body = CREATE_ACCOUNT_SCHEMA.safeParse(await req.json());
   if (!body.success) {
      Log.error(body.error.format(), req.url);
      return NextResponse.json(body.error.issues, {
         // Bad Request
         status: 400,
      });
   }

   const data = body.data;

   try {
      await db.execute(sql`BEGIN TRANSACTION`);

      let user: User;
      switch (data.id) {
         case "email": {
            // create auth user
            user = await auth.createUser({
               primaryKey: {
                  providerId: data.id,
                  password: data.password,
                  providerUserId: data.email,
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
         firstName: data.firstName,
         lastName: data.lastName,
      });

      // create associated page
      await db.insert(schema.page).values({
         primaryProfileId: user.id,
         handle: data.handle,
         title: `${data.firstName} ${data.lastName}`,
         allowExternal: false,
         details:
            "This is a test page. This page was created automatically in the user.create endpoint " +
            "The more test I write here he better the test will be because it causes this to grow " +
            "and the text to wrap, but whatever la la la la la this is just random text anyway. Lorem ipsum hurts my eyes",
      });

      await db.execute(sql`COMMIT TRANSACTION`);

      const what = await db.query.user.findFirst({
         where: (table, { eq }) => eq(table.id, user.id),
         with: {
            keys: true,
            profile: {
               with: {
                  page: true,
               },
            },
         },
      });

      return NextResponse.json({
         body: what,
      });
   } catch (e) {
      await db.execute(sql`ROLLBACK TRANSACTION`);
      Log.error(e, req.url);
      return NextResponse.error();
   }
};
