import { auth } from "@website/lucia";
import { AuthRequest, Auth, Key } from "lucia-auth";
import { z } from "zod";

export const SIGN_IN_SCHEMA = z.union([
   z.object({
      id: z.literal("email"),
      password: z.string(),
      email: z.string().email(),
   }),
   z.object({
      id: z.literal(""),
   }),
]);

export type InputSchema = z.infer<typeof SIGN_IN_SCHEMA>;

export type ApiError = {
   error: string;
   help?: string;
   status: number;
};

type Result<D extends object, E extends object> =
   | ({ success: true } & D)
   | ({ success: false } & E);

export const checkSession = async (
   authRequest: AuthRequest<Auth>
): Promise<Result<{}, { error: ApiError }>> => {
   // ensure there isn't already a session
   const session = await authRequest.validate();
   if (session !== null) {
      return {
         success: false,
         error: {
            error: "Session already exists",
            help: "Sign out of the current session first",
            status: 503,
         },
      };
   }
   return { success: true };
};

export const getKey = async (
   input: InputSchema
): Promise<Result<{ key: Key }, { error: ApiError }>> => {
   let key: Key | undefined;
   try {
      switch (input.id) {
         case "email": {
            key = await auth.useKey(input.id, input.email, input.password);
         }
      }
   } catch {
      /* key === undefined */
   }
   if (!!key) {
      return {
         success: true,
         key,
      };
   }

   return {
      success: false,
      error: {
         error: "INVALID_CREDENTIALS",
         help: "",
         status: 400,
      },
   };
};
