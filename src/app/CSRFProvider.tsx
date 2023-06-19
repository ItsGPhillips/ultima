"use client";
import { PropsWithChildren } from "react";

const originalFetch = window.fetch;

export type CSRFProviderProps = PropsWithChildren<{ csrfToken: string | null }>;
export const CSRFProvider = (props: CSRFProviderProps) => {
   const csrfToken = props.csrfToken ?? "NOT SET";

   window.fetch = function (input, init) {
      if (!init) {
         init = {};
      }
      if (!init.headers) {
         init.headers = new Headers();
      }
      // init.headers could be:
      //   `A Headers object, an object literal,
      //    or an array of two-item arrays to set request’s headers.`
      if (init.headers instanceof Headers) {
         init.headers.append("X-CSRF-Token", csrfToken);
      } else if (init.headers instanceof Array) {
         init.headers.push(["X-CSRF-Token", csrfToken]);
      } else {
         // object ?
         init.headers["X-CSRF-Token"] = csrfToken;
      }
      return originalFetch(input, init);
   };

   return (
      <>
         {props.children}
      </>
   );
};
