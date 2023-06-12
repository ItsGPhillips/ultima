import "./global.scss";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "~/components/Header";
import { ReactQueryProvider } from "~/components/providers/ReactQueryProvider";

import { Roboto } from "next/font/google";
import { cn } from "~/utils/cn";
const font = Roboto({ weight: ["300", "400", "700"], subsets: ["latin"] });

export const metadata = {
   title: "Next.js",
   description: "Generated by Next.js",
};

export const revalidate = 0;

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <ClerkProvider>
         <ReactQueryProvider>
            <html lang="en" suppressHydrationWarning>
               <body
                  className={cn(
                     "bg-zinc-900 text-white antialiased",
                     font.className
                  )}
                  suppressHydrationWarning
               >
                  <Header />
                  <div className="mt-[var(--header-height)] w-full z-[500]">
                     {children}
                  </div>
               </body>
            </html>
         </ReactQueryProvider>
      </ClerkProvider>
   );
}
