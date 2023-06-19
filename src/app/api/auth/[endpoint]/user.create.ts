import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/database";
import { profile } from "~/server/database/schema/user";
import { auth } from "~/server/lucia";
import { Log } from "~/utils/log";

export const PROVIDERS = {
   EMAIL: "email",
} as const;

const CREATE_ACCOUNT_SCHEMA = z.union([
   z.object({
      id: z.literal("email"),
      password: z.string(),
      email: z.string().email(),
      handle: z.string(),
   }),
   z.object({
      id: z.literal(""),
   }),
]);

type T = z.infer<typeof CREATE_ACCOUNT_SCHEMA>;

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

      let user;
      switch (data.id) {
         case "email": {
            // create auth user
            user = await auth.createUser({
               primaryKey: {
                  providerId: PROVIDERS.EMAIL,
                  password: data.password,
                  providerUserId: data.email,
               },
               attributes: {
                  handle: data.handle,
               },
            });
            break;
         }
         default: {
            throw new Error("Impossible code path");
         }
      }

      // create associated profile
      await db.insert(profile).values({
         handle: user.handle,
         firstName: "John",
         lastName: "Doe",
      });

      await db.execute(sql`COMMIT TRANSACTION`);

      return NextResponse.json({
         body: user,
      });
   } catch (e) {
      await db.execute(sql`ROLLBACK TRANSACTION`);
      Log.error(e, req.url);
      return NextResponse.error();
   }
};
