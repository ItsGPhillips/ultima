import { NextRequest, NextResponse } from "next/server";

export const signOutUser = async (req: NextRequest): Promise<Response> => {
   return NextResponse.next();
};
