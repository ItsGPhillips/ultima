import Link from "next/link";
import { PropsWithChildren } from "react";
import { Seperator as BaseSeperator } from "~/components/shared/Seperator";
import { cn } from "~/utils/cn";

const Header: React.FC<PropsWithChildren> = (props) => (
   <h3 className="mb-2 ml-2 text-3xl font-bold text-white/90">
      {props.children}
   </h3>
);

const Seperator = () => <BaseSeperator className="my-2 !ml-0" />;

const Sidebar = () => {
   return (
      <div
         suppressHydrationWarning
         className={cn(
            "float-left h-[var(--available-area-height)] border-l-[1px] border-white/10 py-2 text-white",
            "flex w-64 flex-col justify-start"
         )}
      >
         <Seperator />
         <Header>Trending</Header>
         <div className="ml-1 flex w-full flex-col gap-1">
            {Array(5)
               .fill(0)
               .map(() => {
                  return (
                     <div
                        className="flex min-w-full items-center gap-2 rounded-md bg-white/5 p-2 hover:bg-white/10"
                     >
                        <div className="flex flex-col gap-2 text-xs">
                           <div className="text-link text-white/75">
                              u/group-name
                           </div>
                           <h4 className="line-clamp-2">
                              Lorem ipsum dolor sit amet consectetur adipisicing
                           </h4>
                        </div>
                        <div className="ml-auto flex flex-col items-center justify-center text-xs text-white/75">
                           <span className="font-bold">73.3K</span>
                           <span>votes</span>
                        </div>
                     </div>
                  );
               })}
         </div>
         <Seperator />
      </div>
   );
};

export default Sidebar;
