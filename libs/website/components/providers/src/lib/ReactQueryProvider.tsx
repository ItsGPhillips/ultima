"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export const ReactQueryProvider = (props: PropsWithChildren) => {
   const [client] = useState(() => new QueryClient());
   return (
      <QueryClientProvider client={client}>
         {props.children}
      </QueryClientProvider>
   );
};
