// "use client";

// import { useQueryClient } from "@tanstack/react-query";
// import { httpBatchLink } from "@trpc/client";
// import { PropsWithChildren, useState } from "react";
// import { getBaseUrl, trpc } from "@website/api/client";

// export const TRPCProvider = (props: PropsWithChildren) => {
//    const queryClient = useQueryClient();
//    const [trpcClient] = useState(() =>
//       trpc.createClient({
//          links: [
//             httpBatchLink({
//                url: `${getBaseUrl()}/trpc`,

//                // You can pass any HTTP headers you wish here
//                async headers() {
//                   return {};
//                },
//             }),
//          ],
//       })
//    );

//    return (
//       <trpc.Provider client={trpcClient} queryClient={queryClient}>
//          {props.children}
//       </trpc.Provider>
//    );
// };
