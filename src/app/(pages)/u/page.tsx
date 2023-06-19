"use client";

import { User } from "@clerk/nextjs/dist/types/server";
import { useState, useTransition } from "react";

const Page = () => {
   const [_, transition] = useTransition();
   const [user, setUser] = useState<any>({});
   return (
      <div className="flex flex-col items-center gap-4">
         <button
            onClick={() => {
               transition(async () => {
               });
            }}
         >
            Get User
         </button>
         <pre className="max-w-2xl whitespace-pre-wrap p-2 border-2">{JSON.stringify(user, null, 2)}</pre>
      </div>
   );
};

export default Page;
