"use client";

import { Dialog, DialogState } from "@website/components/shared";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useBoolean } from "usehooks-ts";
import {
   OPEN_CREATE_ACCOUNT_DIALOG,
   OPEN_SIGNIN_DIALOG,
} from "../events/events";
import { CreateAccountDialog } from "../create-account-dialog/create-account-dialog";
import { SignInDialog } from "../sign-in-dialog/sign-in-dialog";

export const AuthDialogContainer = (props: PropsWithChildren) => {
   const open = useBoolean(false);
   const [variant, setVariant] = useState<"signin" | "create">("signin");

   useEffect(() => {
      const openCreateAccountDialogCallback = () => {
         open.setTrue();
         setVariant("create");
      };

      const openSigninDialogCallback = () => {
         open.setTrue();
         setVariant("signin");
      };

      window.addEventListener(
         OPEN_CREATE_ACCOUNT_DIALOG,
         openCreateAccountDialogCallback
      );
      window.addEventListener(OPEN_SIGNIN_DIALOG, openSigninDialogCallback);

      return () => {
         window.removeEventListener(
            OPEN_CREATE_ACCOUNT_DIALOG,
            openCreateAccountDialogCallback
         );
         window.removeEventListener(
            OPEN_SIGNIN_DIALOG,
            openSigninDialogCallback
         );
      };
   }, []);

   const state = useMemo(
      (): DialogState =>
         new Proxy(
            {
               isOpen: open.value,
            },
            {
               set(_target, prop, value) {
                  switch (prop) {
                     case "isOpen": {
                        open.setValue(value);
                        return true;
                     }
                     default:
                        throw new Error(`Cannot set property ${String(prop)}`);
                  }
               },
            }
         ),
      [open.value]
   );

   return (
      <Dialog.UnmangedProvider
         modal
         open={open.value}
         ctx={state}
         onOpenChange={(value) => {
            open.setValue(value);
         }}
      >
         {props.children}
         <Dialog.Content>
            {variant === "create" ? <CreateAccountDialog /> : <SignInDialog />}
         </Dialog.Content>
      </Dialog.UnmangedProvider>
   );
};
