import { env } from "../../env/src/index.mjs";
import lucia from "lucia-auth";
import { nextjs } from "lucia-auth/middleware";
import { adapter } from "./adapter";
import { zod } from "@website/database";
import { Auth } from "@website/database";

export const auth = lucia({
   adapter,
   env: env.NODE_ENV === "development" ? "DEV" : "PROD",
   middleware: nextjs(),
   csrfProtection: true,
   sessionExpiresIn: {
      activePeriod: 8.64e7, // 24 hours
      idlePeriod: 7.884e9, // 3 months.
   },
   transformDatabaseUser: (
      userData: Required<Readonly<unknown>>
   ): Auth.User => {
      return Object.freeze(zod.Auth.USER_TABLE_SCHEMA.select.parse(userData));
   },
});

export type Auth = typeof auth;
