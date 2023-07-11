"use client";

import { useRouter } from "next/navigation";
import { api } from "@website/api/client";
import { AriaButton } from "@website/components/shared";
import { AuthEvents } from "@website/components/auth";

export const SignInButton = () => {
   const onPress = async () => {
      window.dispatchEvent(AuthEvents.OPEN_SIGNIN_DIALOG_EVENT);
   };

   return (
      <AriaButton
         className="px-4 py-2 text-white hover:bg-white/10"
         onPress={onPress}
      >
         Sign In
      </AriaButton>
   );
};
