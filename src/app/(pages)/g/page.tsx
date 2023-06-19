"use client";

import { testAction } from "./actions";

const Page = () => {
   return (
      <button
         onClick={() => {
            testAction();
         }}
      >
         TEST ACTION
      </button>
   );
};

export default Page;
