"use client";

import { useButton } from "@react-aria/button";
import { AriaButton, Dialog, Spinner } from "@website/components/shared";
import { useRef, useState, useTransition } from "react";
import { AuthEvents } from "../..";
import { prepareState } from "../input/state";
import { z } from "zod";
import { Input } from "../input/input";
import { MdAlternateEmail } from "react-icons/md";
import { api } from "@website/api/client";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useDialogState } from "libs/website/components/shared/src/lib/dialog/Provider";

export const SignInDialog = observer(() => {
   const linkRef = useRef<HTMLSpanElement>(null);
   const { buttonProps } = useButton(
      {
         onPress() {
            window.dispatchEvent(AuthEvents.OPEN_CREATE_ACCOUNT_DIALOG_EVENT);
         },
      },
      linkRef
   );

   const [state] = useState(
      () =>
         ({
            email: prepareState<string>({
               label: "Email",
               schema: z.string().email(),
               type: "email",
            }),
            password: prepareState<string>({
               label: "Email",
               schema: z.string().nonempty(),
               type: "password",
            }),
         } as const)
   );

   const [pending, transition] = useTransition();
   const [errorMessage, setErrorMessage] = useState<string>();
   const router = useRouter();
   const dialogState = useDialogState();

   return (
      <div className="flex max-h-[75vh] w-[400px] max-w-full flex-col bg-zinc-900 p-4 text-black">
         <div className="flex h-16 w-full shrink-0 items-center justify-center">
            <Dialog.Title className="text-xl font-bold text-white">
               Sign In
            </Dialog.Title>
         </div>
         <div className="mb-6 shrink-0 px-6">
            <div className="items-s flex h-full flex-col justify-between">
               <Input
                  labelKind="normal"
                  name="Email"
                  state={state.email}
                  preInput={<MdAlternateEmail className="h-5 w-5" />}
               />
               <Input
                  labelKind="normal"
                  name="Password"
                  state={state.password}
               />
            </div>
            <div className="my-2 flex justify-center">
               <AriaButton
                  className="h-10 w-24 border-2 border-green-400 bg-green-400/30 px-2 text-white/80"
                  onPress={() => {
                     transition(async () => {
                        const results = await Promise.all([
                           state.email.validate(),
                           state.password.validate(),
                        ]);

                        if (results.includes(false)) {
                           return;
                        }

                        try {
                           await api.auth.signIn.mutate({
                              id: "email",
                              email: state.email.value!,
                              password: state.password.value!,
                           });
                           setErrorMessage(undefined);
                           dialogState.isOpen = false;
                           router.refresh();
                        } catch {
                           setErrorMessage("Incorrect email or password");
                        }
                     });
                  }}
               >
                  {pending ? (
                     <span className="h-5 w-5">
                        <Spinner />
                     </span>
                  ) : (
                     "Sign In"
                  )}
               </AriaButton>
            </div>
            <div className="flex justify-center">
               <span className="text-red-400">{errorMessage}</span>
            </div>
         </div>

         <div className="flex w-full justify-center text-sm text-white/80">
            <span>
               Don't have an account? Create one{" "}
               <span
                  ref={linkRef}
                  className="font-bold italic text-blue-600 hover:cursor-pointer"
                  {...buttonProps}
               >
                  here
               </span>
            </span>
         </div>
      </div>
   );
});
