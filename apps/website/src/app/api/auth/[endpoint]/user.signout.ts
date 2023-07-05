import { auth } from "@website/lucia";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const signOutUser = async (req: NextRequest): Promise<NextResponse> => {
   const authRequest = auth.handleRequest({ request: req, cookies });
   const { session } = await authRequest.validateUser();
   if (!session) {
      return NextResponse.json(null, {
         status: 401,
      });
   }

   await auth.invalidateSession(session.sessionId);
   authRequest.setSession(null); // delete session cookie

   return NextResponse.json(null, {
      status: 302,
      headers: {
         location: "/",
      },
   });
};
