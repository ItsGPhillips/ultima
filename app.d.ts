import { Auth } from "~/server/database/types";

declare global {
   /// <reference types="lucia-auth" />
   declare namespace Lucia {
      type Auth = import("./src/server/lucia/index.js").Auth;
      type UserAttributes = Omit<Auth.User, "id">;
   }
}
