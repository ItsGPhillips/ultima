import { NextRequest, NextResponse } from "next/server";
import { db } from "@website/database";
import { auth } from "@website/lucia";

type Context = { params: { handle: string } };

export const GET = async (request: NextRequest, { params }: Context) => {
   const profile = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, params.handle),
      columns: {},
      with: {
         profile: true,
      },
   });

   return NextResponse.json({ ...profile });
};
