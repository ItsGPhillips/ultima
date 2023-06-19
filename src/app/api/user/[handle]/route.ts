import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/database";
import { auth } from "~/server/lucia";

type Context = { params: { handle: string } };

export const GET = async (request: NextRequest, { params }: Context) => {

   const profile = await db.query.user.findFirst({
      where: (table, { eq }) => eq(table.handle, params.handle),
      columns: {},
      with: {
         profile: true,
      },
   });

   return NextResponse.json({ ...profile });
};
