import { NextRequest, NextResponse } from "next/server";
import csrf from "edge-csrf";

const csrfProtect = csrf({
   cookie: {
      name: "_csrfToken",
      secure: process.env.NODE_ENV === "production",
   },
});

export default async (request: NextRequest) => {
   const response = NextResponse.next();
   // csrf protection
   const csrfError = await csrfProtect(request, response);
   // check result
   if (csrfError) {
      return new NextResponse("invalid csrf token", { status: 403 });
   }
   return response;
};

export const config = {
   matcher: ["/", "/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
