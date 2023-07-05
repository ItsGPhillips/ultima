import { NextRequest, NextResponse } from "next/server";
import csrf from "edge-csrf";

const csrfProtect = csrf({
   cookie: {
      httpOnly: true,
      sameSite: true,
      name: "_csrfToken",
      secure: process.env.NODE_ENV === "production",
   },
});

const CSRF_EXCLUDE_DOMAINS = ["localhost:3000", "localhost:4200"];

export default async (request: NextRequest) => {
   const response = NextResponse.next();

   // CSRF protection excluded on these domains
   if (CSRF_EXCLUDE_DOMAINS.includes(request.nextUrl.host)) {
      return response;
   }

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
