"use server"

import { cookies, headers } from "next/headers";
import { Log } from "~/utils/log";

const csrfWrapper = () => {

   const csrfTokenCookie = cookies().get("_csrf_token");
   const csrfTokenHeader = headers().get("X-CSRF-TOKEN");

}

export const testAction = () => {
   Log.debug("CALLED FROM SERVER ACTION")
}