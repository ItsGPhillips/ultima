import { PropsWithChildren } from "react";
import { Seperator as BaseSeperator } from "@website/components/shared";
import { cn } from "@website/utils";

const Header: React.FC<PropsWithChildren> = (props) => (
   <h3 className="m-2 text-3xl font-bold text-white/90">
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
         <div className="flex w-full flex-col gap-1 px-1">
            {Array(5)
               .fill(0)
               .map(() => {
                  return (
                     <div className="flex min-w-full items-center gap-2 rounded-md bg-white/5 p-2 hover:bg-white/10">
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
