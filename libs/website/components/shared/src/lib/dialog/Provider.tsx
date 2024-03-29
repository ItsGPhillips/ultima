"use client";
import { useBoolean } from "usehooks-ts";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
   createContext,
   useContext,
   PropsWithChildren,
   useMemo,
   useEffect,
} from "react";

export type DialogState = {
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
   open?: boolean;
   modal?: boolean;
   onOpenChange?: (value: boolean) => void;
   interceptChangeCallback?: (change: boolean) => boolean;
}>;

export const DialogStateProvider = (props: DialogStateProviderProps) => {
   const isOpen = useBoolean(props.defaultOpen);

   useEffect(() => {
      if (typeof props.open === "boolean") {
         isOpen.setValue(props.open);
      }
   }, [props.open]);

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
      <UnmangaedDialogStateProvider
         ctx={state}
         open={isOpen.value}
         onOpenChange={(value) => {
            if (props.interceptChangeCallback) {
               value = props.interceptChangeCallback(value);
            }
            isOpen.setValue(value);
         }}
         modal={props.modal}
      >
         {props.children}
      </UnmangaedDialogStateProvider>
   );
};

export const UnmangaedDialogStateProvider = (props: {
   children?: React.ReactNode;
   open?: boolean;
   defaultOpen?: boolean;
   onOpenChange?(open: boolean): void;
   modal?: boolean;
   ctx: { isOpen: boolean };
}) => {
   return (
      <DIALOG_STATE_CONTEXT.Provider value={props.ctx}>
         <DialogPrimitive.Root {...props}>
            {props.children}
         </DialogPrimitive.Root>
      </DIALOG_STATE_CONTEXT.Provider>
   );
};
