import { NextRequest, NextResponse } from "next/server";
import { createUser } from "./user.create";
import { signInUser } from "./user.signin";
import { signOutUser } from "./user.signout";

type Context = { params: { endpoint: string } };

export const POST = (req: NextRequest, { params }: Context) => {
   switch (params.endpoint) {
      case "user.create": {
         return createUser(req);
      }
      case "user.signin": {
         return signInUser(req);
      }
      case "user.signout": {
         return signOutUser(req);
      }
   }
   return NextResponse.json(null, {
      status: 501,
   });
};

export const GET = (req: NextRequest, { params }: Context) => {
   switch (params.endpoint) {
   }
   return NextResponse.json(null, {
      status: 501,
   });
};
