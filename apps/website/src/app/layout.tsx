import "./global.scss";

import { Header } from "@website/components/header";
import { Roboto } from "next/font/google";
import { cn } from "@website/utils";
import {
   CSRFProvider,
   ReactQueryProvider,
   SSRProvider,
} from "@website/components/providers";
import { Tooltip } from "@website/components/shared";
import { headers } from "next/headers";
const font = Roboto({ weight: ["300", "400", "700"], subsets: ["latin"] });

export const metadata = {
   title: "Next.js",
   description: "Generated by Next.js",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
   const csrfToken = headers().get("X-CSRF-Token") ?? null;
   return (
      <SSRProvider>
         <CSRFProvider csrfToken={csrfToken}>
            <html lang="en" suppressHydrationWarning>
               <body
                  className={cn(
                     "bg-zinc-900 text-white antialiased",
                     font.className
                  )}
                  style={{
                     overflowAnchor: "none",
                  }}
                  suppressHydrationWarning
               >
                  <ReactQueryProvider>
                     <Tooltip.Provider delayDuration={80}>
                        <Header />
                        <div className="z-[500] mt-[var(--header-height)] w-full">
                           {children}
                        </div>
                     </Tooltip.Provider>
                  </ReactQueryProvider>
               </body>
            </html>
         </CSRFProvider>
      </SSRProvider>
   );
};

export default RootLayout;