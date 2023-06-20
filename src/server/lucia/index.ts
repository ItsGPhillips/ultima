import { env } from "~/env.mjs";
import lucia from "lucia-auth";
import { nextjs } from "lucia-auth/middleware";
import { adapter } from "./adapter";
import { Auth as AuthZod } from "../database/zod";
import { Auth } from "../database/types";

// Lucia needs this...
// global.crypto = require("crypto");

export const auth = lucia({
   adapter,
   env: env.NODE_ENV === "development" ? "DEV" : "PROD",
   middleware: nextjs(),
   csrfProtection: true,
   sessionExpiresIn: {
      activePeriod: 8.64e+7, // 24 hours
      idlePeriod: 7.884e+9, // 3 months.
   },
   transformDatabaseUser: (
      userData: Required<Readonly<unknown>>
   ): Auth.User => {
      return Object.freeze(AuthZod.USER_TABLE_SCHEMA.select.parse(userData));
   },
});

export type Auth = typeof auth;
