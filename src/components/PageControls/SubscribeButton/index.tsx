import { db } from "~/server/database";
import { Button } from "./button";
import { createTRPCCaller } from "~/server/api/root";
import { getAuth } from "@clerk/nextjs/dist/types/server-helpers.server";
import { auth } from "@clerk/nextjs";

export type SubscribeButtonProps = {
   groupId: string;
};

export const SubscribeButton = async (props: SubscribeButtonProps) => {
   const data = await db.query.subscription.findFirst({
      columns: {},
      where: (subscription, { and, eq }) =>
         and(
            eq(subscription.groupId, props.groupId),
            eq(subscription.profileHandle, "")
         ),
   });
   return (
      <Button
         groupId={props.groupId}
         isSubscribed={data !== undefined}
      />
   );
};
