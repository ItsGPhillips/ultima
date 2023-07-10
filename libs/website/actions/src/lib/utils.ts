"use server";

import { User } from "lucia-auth";
import { auth } from "@website/lucia";
import { cookies } from "next/headers";

export const currentUser = async () => {
   const authRequest = auth.handleRequest({ cookies });
   const { user } = await authRequest.validateUser();
   return user;
};

export const withAuth = <T extends Array<any>, U>(
   action: (user: User, ...args: T) => Promise<U>
) => {
   return async (...args: T): Promise<U> => {
      const user = await currentUser();
      if (user === null) {
         throw new Error("UNAUTHORISED");
      }
      return action(user, ...args);
   };
};
