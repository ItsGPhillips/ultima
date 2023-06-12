import { HeaderScrollHandle } from "~/components/Header/HideOnScroll";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { Post } from "~/components/Post";

import { PageControls } from "~/components/PageControls";

const Page = ({ params }: any) => {
   const ua = userAgent({ headers: headers() });
   return (
      <>
         {ua.device.type === "mobile" && <HeaderScrollHandle />}
         <PageControls />
         <div className="flex mt-1 flex-col gap-2">
            {Array(10)
               .fill(null)
               .map((_, idx) => {
                  return <Post key={idx}></Post>;
               })}
         </div>
      </>
   );
};

export default Page;
