import { env } from "~/env.mjs";
import pino, { LoggerOptions } from "pino";
import { serialize } from "superjson";
import {} from "json-colorizer";

export namespace Log {
   const options: LoggerOptions = {
      serializers: {
         "*": (obj: any) => serialize(obj).json,
      },
      redact: ["key.hashed_password", "hashedPassword"],
      level: env.NODE_ENV === "production" ? "warn" : "debug",
   };
   const instance =
      env.NODE_ENV === "production"
         ? pino(options)
         : pino(
              options,
              require("pino-pretty")({
                 colorize: true,
                 colorizeObjects: true,
              })
           );

   export const debug = instance.debug.bind(instance);
   export const trace = instance.trace.bind(instance);
   export const info = instance.info.bind(instance);
   export const warn = instance.warn.bind(instance);
   export const error = instance.error.bind(instance);
   export const fatal = instance.fatal.bind(instance);
   export const child = instance.child.bind(instance);
}
