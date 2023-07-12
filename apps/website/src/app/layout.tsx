import "./global.scss";

import { Header, ProgressBar } from "@website/components/header";
import { Roboto } from "next/font/google";
import { cn } from "@website/utils";
import {
   CSRFProvider,
   ReactQueryProvider,
} from "@website/components/providers";
import { Tooltip } from "@website/components/shared";
import { headers } from "next/headers";
import { AuthDialogContainer } from "@website/components/auth";
import colors from "tailwindcss/colors";

const font = Roboto({ weight: ["300", "400", "700"], subsets: ["latin"] });

export const metadata = {
   title: "Ultima",
   description: "Portfolio Social media website by George Phillips",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
   const csrfToken = headers().get("X-CSRF-Token") ?? null;
   return (
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
                     <AuthDialogContainer>
                        <ProgressBar
                           color={colors.blue["400"]}
                           height="2px"
                           options={{ trickle: true, showSpinner: false }}
                           shallowRouting
                        />
                        <Header />
                        <div className="z-[500] mt-[var(--header-height)] w-full">
                           {children}
                        </div>
                     </AuthDialogContainer>
                  </Tooltip.Provider>
               </ReactQueryProvider>
            </body>
         </html>
      </CSRFProvider>
   );
};

export default RootLayout;
