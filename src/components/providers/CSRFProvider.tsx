"use client";
import { PropsWithChildren, useState } from "react";
import { useIsomorphicLayoutEffect } from "usehooks-ts";
import { getBaseUrl } from "~/utils/getBaseUrl";

declare global {
   interface Window {
      ["$ultima_csrf_fetch_brand"]: typeof fetchSymbol | undefined;
   }
}
const fetchSymbol = Symbol();

const useIsClient = () => {
   const [isClient, setClient] = useState(false);
   useIsomorphicLayoutEffect(() => {
      setClient(true);
   }, []);
   return isClient;
};

export type CSRFProviderProps = PropsWithChildren<{ csrfToken: string | null }>;
export const CSRFProvider = (props: CSRFProviderProps) => {
   const isClient = useIsClient();
   if (!isClient) {
      // we are on the server.
      return <>{props.children}</>;
   }

   if (window.$ultima_csrf_fetch_brand === undefined) {
      window.$ultima_csrf_fetch_brand = fetchSymbol;

      const originalFetch = window.fetch;

      const csrfToken = props.csrfToken ?? "NOT SET";
      window.fetch = function (input: RequestInfo | URL, init) {
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
   }

   return <>{props.children}</>;
};
