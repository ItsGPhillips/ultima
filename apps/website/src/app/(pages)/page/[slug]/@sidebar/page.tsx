import { PropsWithChildren } from "react";
import { Seperator as BaseSeperator } from "@website/components/shared";
import { cn } from "@website/utils";

const Header: React.FC<PropsWithChildren> = (props) => (
   <h3 className="mx-2 mb-1 mt-3 text-3xl font-bold flex items-end text-white/90">
      {props.children}
   </h3>
);

const Seperator = () => <BaseSeperator className="my-2 !ml-0" />;

const Sidebar = () => {
   return (
      <div
         suppressHydrationWarning
         className={cn(
            "float-left h-[var(--available-area-height)] border-l-[1px] border-white/10 text-white",
            "flex w-full max-w-[22rem] flex-col justify-start"
         )}
      >
         <Header>Trending</Header>
         <div className="flex w-full flex-col gap-1 p-1">
            <div className="w-full h-24 rounded-md bg-white/5"></div>
            <div className="w-full h-24 rounded-md bg-white/5"></div>
            <div className="w-full h-24 rounded-md bg-white/5"></div>
            <div className="w-full h-24 rounded-md bg-white/5"></div>
            <div className="w-full h-24 rounded-md bg-white/5"></div>
         </div>
         <Seperator />
      </div>
   );
};

export default Sidebar;
