"use server";

import { and, eq } from "drizzle-orm";
import { Log } from "~/utils/log";
import { db } from "./database";
import { subscription } from "./database/schema/user";
import { auth } from "./lucia";
import { cookies } from "next/headers";

const getCurrentUser = async () => {
   const authRequest = auth.handleRequest({ cookies });
   const { user } = await authRequest.validateUser();
   return user;
};

export const getPageSubscription = async (
   pageId: string,
   profileHandle: string
) => {
   const data = await db.query.subscription.findFirst({
      columns: {
         profileHandle: false,
      },
      where: and(
         eq(subscription.groupId, pageId),
         eq(subscription.profileHandle, profileHandle)
      ),
   });
   return {
      subscription: data ?? null,
   };
};

export const getIsSubscribed = async (pageId: string): Promise<boolean> => {
   const user = await getCurrentUser();
   if (user === null) {
      throw new Error("UNAUTHORISED");
   }
   const data = await getPageSubscription(pageId, user.handle);
   return data.subscription !== null;
};

export const toggleSubscription = async (pageId: string) => {
   const user = await getCurrentUser();
   if (user === null) {
      throw new Error("UNAUTHORISED");
   }

   const s = await getPageSubscription(pageId, user.handle);

   if (s.subscription) {
      await db
         .delete(subscription)
         .where(
            and(
               eq(subscription.groupId, pageId),
               eq(subscription.profileHandle, user.handle)
            )
         );
      return;
   }

   await db.insert(subscription).values({
      groupId: pageId,
      profileHandle: user.handle,
   });
};
