import { Button } from "./button";
import { getIsSubscribed } from "~/server/actions";

export type SubscribeButtonProps = {
   handle: string;
};

export const SubscribeButton = async (props: SubscribeButtonProps) => {
   const isSubscribed = await getIsSubscribed(props.handle);
   return (
      <Button
         groupId={props.handle}
         isSubscribed={isSubscribed}
      />
   );
};
