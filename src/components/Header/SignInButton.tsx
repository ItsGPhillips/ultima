"use client";

import { useButton } from "@react-aria/button";
import { useRef } from "react";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { useRouter } from "next/navigation";

export type SignInButtonProps = {};

export const SignInButton = (props: SignInButtonProps) => {
   const router = useRouter();
   const ref = useRef<HTMLButtonElement>(null);
   const { buttonProps } = useButton(
      {
         onPress: async () => {
            const body = JSON.stringify({
               id: "email",
               password: "12345",
               email: "test@abc.com",
            });
            const response = await fetch(
               `${getBaseUrl()}/api/auth/user.signin`,
               {
                  method: "POST",
                  body,
               }
            );
            if (!response.ok) {
               console.log(await response.json());
               // TODO handle error.
            }
            router.refresh();
         },
      },
      ref
   );
   return (
      <button
         ref={ref}
         className="rounded-xl bg-neutral-800 p-2 text-white"
         {...buttonProps}
      >
         Sign In
      </button>
   );
};
