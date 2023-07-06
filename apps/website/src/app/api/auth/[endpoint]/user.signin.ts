import { AuthRequest, Key } from "lucia-auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Auth, auth } from "@website/lucia";
import { Log } from "@website/utils";

const SIGN_IN_SCHEMA = z.union([
   z.object({
      id: z.literal("email"),
      password: z.string(),
      email: z.string().email(),
   }),
   z.object({
      id: z.literal(""),
   }),
]);

type InputSchema = z.infer<typeof SIGN_IN_SCHEMA>;

type Result<D extends object, E extends object> =
   | ({ success: true } & D)
   | ({ success: false } & E);

const checkSession = async (
   authRequest: AuthRequest<Auth>
): Promise<Result<{}, { response: NextResponse }>> => {
   // ensure there isn't already a session
   const session = await authRequest.validate();
   if (session !== null) {
      return {
         success: false,
         response: NextResponse.json(
            {
               error: "Session already exists",
               help: "Sign out of the current session first",
            },
            { status: 503 }
         ),
      };
   }
   return { success: true };
};

const getKey = async (
   input: InputSchema
): Promise<
   { success: true; key: Key } | { success: false; response: NextResponse }
> => {
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
      response: NextResponse.json(
         {
            error: "INVALID_CREDENTIALS",
         },
         { status: 400 }
      ),
   };
};

export const signInUser = async (request: NextRequest): Promise<Response> => {
   const body = SIGN_IN_SCHEMA.safeParse(await request.json());
   if (!body.success) {
      Log.error(body.error.format(), request.url);
      return NextResponse.json(body.error.format(), {
         // Bad Request
         status: 400,
      });
   }
   const input = body.data;
   const authRequest = auth.handleRequest({
      request,
      cookies,
   });

   // --- Ensure there isn't already and active session.
   const checkSessionResult = await checkSession(authRequest);
   if (!checkSessionResult.success) {
      return checkSessionResult.response;
   }
   // --- Get the auth.key associated with the provided credentials
   const getKeyResult = await getKey(input);
   if (!getKeyResult.success) {
      return getKeyResult.response;
   }
   // --- Create a session for the user associated with the key.
   const key = getKeyResult.key;
   const session = await auth.createSession(key.userId);
   // --- Write the session into the cookies.
   authRequest.setSession(session);

   return NextResponse.json(session, {
      status: 200,
   });
};
