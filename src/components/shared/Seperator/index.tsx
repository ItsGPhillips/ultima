import { cn } from "~/utils/cn";

export const Seperator: React.FC<{ className?: string }> = (props) => {
   return (
      <span
         className={cn("mt-2 border-b-[1px] border-white/10", props.className)}
      />
   );
};
