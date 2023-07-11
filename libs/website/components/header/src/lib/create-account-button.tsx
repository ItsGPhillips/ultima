"use client";

import { useRouter } from "next/navigation";
import { AriaButton } from "@website/components/shared";
import { AuthEvents } from "@website/components/auth";
export type CreateAccountButtonProps = {};

export const CreateAccountButton = (props: CreateAccountButtonProps) => {
   const router = useRouter();

   return (
      <AriaButton
         onPress={() => {
            window.dispatchEvent(AuthEvents.OPEN_CREATE_ACCOUNT_DIALOG_EVENT);
         }}
         className="whitespace-nowrap border-2 border-green-400 bg-green-400/30 p-2 px-4 text-white hover:bg-green-400/40"
      >
         Create Account
      </AriaButton>
   );
};
