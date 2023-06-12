import { headers } from "next/headers";
import { userAgent } from "next/server";
import { ChanneLink } from "~/components/Sidebar/ChannelLink";
import { UserAvatar } from "~/components/shared/UserAvatar";

const Content = () => {
   return (
      <div className="sticky top-[var(--header-height)] h-[var(--available-area-height)] w-64 flex-1 grow  border-2"></div>
   );
};

const Sidebar = () => {
   const ua = userAgent({ headers: headers() });
   const isTouchDevice = /mobile|tablet/.test(ua.device.type ?? "");
   return <Content />;
};
export default Sidebar;
