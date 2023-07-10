import type { Auth } from "@website/database";

declare global {
   /// <reference types="lucia-auth" />
   namespace Lucia {
      type Auth = import("./src/index.ts").Auth;
      type UserAttributes = Omit<Auth.User, "id">;
   }
}
