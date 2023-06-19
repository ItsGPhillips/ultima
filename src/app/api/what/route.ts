import { NextRequest, NextResponse } from "next/server";

export const GET = (
   req: NextRequest,
   { params }: { params: { slug: string[] } }
) => {
   return NextResponse.json("what");
};

export const POST = () => {
   return NextResponse.json("soo ")
}