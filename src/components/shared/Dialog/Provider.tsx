"use client"
import { useBoolean } from "usehooks-ts";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { createContext, useContext, PropsWithChildren, useMemo } from "react";

type DialogState = {
   isOpen: boolean;
};

const DIALOG_STATE_CONTEXT = createContext<DialogState | null>(null);

export const useDialogState = () => {
   const ctx = useContext(DIALOG_STATE_CONTEXT);
   if (ctx === null) {
      throw new Error("Dialog State context was null");
   }
   return ctx;
};

export type DialogStateProviderProps = PropsWithChildren<{
   defaultOpen?: boolean;
   modal?: boolean;
}>;

export const DialogStateProvider = (props: DialogStateProviderProps) => {
   const isOpen = useBoolean(props.defaultOpen);

   const state = useMemo(
      (): DialogState =>
         new Proxy(
            {
               isOpen: isOpen.value,
            },
            {
               set(_target, prop, value) {
                  switch (prop) {
                     case "isOpen": {
                        isOpen.setValue(value);
                        return true;
                     }
                     default:
                        throw new Error(`Cannot set property ${String(prop)}`);
                  }
               },
            }
         ),
      [isOpen.value]
   );

   return (
      <DIALOG_STATE_CONTEXT.Provider value={state}>
         <DialogPrimitive.Root
            open={isOpen.value}
            onOpenChange={(value) => {
               isOpen.setValue(value);
            }}
            modal={props.modal}
         >
            {props.children}
         </DialogPrimitive.Root>
      </DIALOG_STATE_CONTEXT.Provider>
   );
};
