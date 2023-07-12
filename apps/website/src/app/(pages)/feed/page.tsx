import { HeaderScrollHandle } from "@website/components/header";
import { userAgent } from "next/server";
import { headers } from "next/headers";
import { PageFeed } from "@website/components/page";

const Page = async (ctx: any) => {
   const ua = userAgent({ headers: headers() });
   return (
      <>
         {ua.device.type === "mobile" && <HeaderScrollHandle />}
         <PageFeed homeFeed />
      </>
   );
};

export default Page;
