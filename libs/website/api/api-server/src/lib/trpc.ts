import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import superjson from "superjson";
import { AuthRequest } from "lucia-auth";
import { auth } from "@website/lucia";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { cookies as nextCookies } from "next/headers";
import { NextApiRequest } from "next/types";
import { Log } from "@website/utils";
import { NextRequest } from "next/dist/server/web/spec-extension/request";

type CreateContextOptions = {
   authRequest: AuthRequest;
};

export const createTRPCContext = (opts: {
   authRequest: ReturnType<typeof auth.handleRequest>;
}): CreateContextOptions => {
   return {
      authRequest: opts.authRequest,
   };
};

const _createTRPCContext = (opts: CreateNextContextOptions) => {
   // used only for inference
   Log.error("this should not be called")
   return createTRPCContext({ authRequest: {} as any });
};

export const trpc = initTRPC.context<typeof _createTRPCContext>().create({
   transformer: superjson,
   isDev: process.env["NODE_ENV"] === "developemnt",
   errorFormatter({ shape, error }) {
      return {
         ...shape,
         data: {
            ...shape.data,
            zodError:
               error.cause instanceof ZodError ? error.cause.flatten() : null,
         },
      };
   },
});

export const router = trpc.router;

export const publicProcedure = trpc.procedure;
