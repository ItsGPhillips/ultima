import { headers } from "next/headers";
import "server-only";

export const getPathSegments = () => {
   const referer = headers().get("referer") ?? "";
   const url = new URL(referer);
   return url.pathname.split("/").filter((val) => val.length >= 1);
};
