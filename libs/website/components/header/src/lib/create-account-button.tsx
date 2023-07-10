"use client";

import { useRouter } from "next/navigation";
import { Button, Dialog } from "@website/components/shared";
import { CreateAccountDialog } from "./create-account-dialog/create-account-dialog";
import { Provider as CreateAccountStateProvider } from "./create-account-dialog/provider";
export type CreateAccountButtonProps = {};

export const CreateAccountButton = (props: CreateAccountButtonProps) => {
   const router = useRouter();

   const callback = (change: boolean) => {

   }

   return (
      <Dialog.Provider>
         <Dialog.Trigger asChild>
            <Button className="whitespace-nowrap border-2 border-green-400 bg-green-400/30 p-2 px-4 text-white hover:bg-green-400/40">
               Create Account
            </Button>
         </Dialog.Trigger>
         <Dialog.Content>
            <CreateAccountStateProvider>
               <CreateAccountDialog />
            </CreateAccountStateProvider>
         </Dialog.Content>
      </Dialog.Provider>
   );
};
