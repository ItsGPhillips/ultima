"use client";

import { useRouter } from "next/navigation";
import { api } from "@website/api/client";
import { AriaButton } from "@website/components/shared";

export type SignInButtonProps = {};

export const SignInButton = (props: SignInButtonProps) => {
   const router = useRouter();

   const onPress = async () => {
      await api.auth.signIn.mutate({
         id: "email",
         password: "12345",
         email: "jood@mail.com",
      });

      router.refresh();
   };

   return (
      <AriaButton
         className="text-white py-2 px-4 hover:bg-white/10"
         onPress={onPress}
      >
         Sign In
      </AriaButton>
   );
};
