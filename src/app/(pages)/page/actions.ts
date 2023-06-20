"use server"

import { Log } from "~/utils/log";

export const testAction = () => {
   Log.debug("CALLED FROM SERVER ACTION")
}