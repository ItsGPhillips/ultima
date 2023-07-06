'use client';

import { useButton } from '@react-aria/button';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@website/api/client';

export type SignInButtonProps = {};

export const SignInButton = (props: SignInButtonProps) => {
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(
    {
      onPress: async () => {
        const payload = {
          id: 'email',
          password: '12345',
          email: 'jood@mail.com',
          firstName: 'Jade',
          lastName: 'Broadhurst',
          handle: 'jadster',
        };

        // const body = JSON.stringify({
        //   id: 'email',
        //   password: '12345',
        //   email: 'jood@mail.com',
        // });

        await api.auth.signIn.mutate({
          id: 'email',
          password: '12345',
          email: 'jood@mail.com',
        })

        // const response = await fetch('/api/auth/user.signin', {
        //   method: 'POST',
        //   body,
        // });

        // if (!response.ok) {
        //   console.log(await response.json());
        //   // TODO handle error.
        // }
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
