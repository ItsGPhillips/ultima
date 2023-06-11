import { headers } from "next/headers";
import { userAgent } from "next/server";
import { PositionFixed } from "~/components/PositionFixed";
import { ChanneLink } from "~/components/Sidebar/ChannelLink";
import { UserAvatar } from "~/components/shared/UserAvatar";

const Content = () => {
   return (
      <PositionFixed className="relative z-[400] h-[var(--available-area-height)] flex-1 shrink-0">
         <div>
            <h3 className="flex h-14 shrink-0 items-center justify-center border-white/20 text-lg font-bold">
               Recommended
            </h3>
            <ul className="flex w-full flex-col items-stretch gap-2">
               <li>
                  <ChanneLink>
                     <span>Channel Name</span>
                     <UserAvatar name="Channel Name" />
                  </ChanneLink>
               </li>
               <li>
                  <ChanneLink>
                     <span>Channel Name</span>
                     <UserAvatar name="Channel Name" />
                  </ChanneLink>
               </li> 
               <li>
                  <ChanneLink>
                     <span>Channel Name</span>
                     <UserAvatar name="Channel Name" />
                  </ChanneLink>
               </li>
            </ul>
         </div>
         <hr className="mt-2 border-white/10"/>
         <div>
            <h3 className="flex h-14 shrink-0 items-center justify-center border-white/20 text-lg font-bold">
               Subscriptions
            </h3>
            <ul className="flex w-full flex-col items-stretch gap-2">
               {Array(10)
                  .fill(null)
                  .map((_, idx) => {
                     return (
                        <li key={idx}>
                           <ChanneLink>
                              <span>Channel Name</span>
                              <UserAvatar name="Channel Name" />
                           </ChanneLink>
                        </li>
                     );
                  })}
            </ul>
         </div>
      </PositionFixed>
   );
};

const Sidebar = () => {
   const ua = userAgent({ headers: headers() });
   const isTouchDevice = /mobile|tablet/.test(ua.device.type ?? "");

   return <Content />;
};
export default Sidebar;
