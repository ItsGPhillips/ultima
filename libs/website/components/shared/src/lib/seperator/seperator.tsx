import { cn } from "@website/utils";

export const Seperator = (props: { className?: string }) => {
   return (
      <span
         className={cn("mt-2 border-b-[1px] border-white/10", props.className)}
      />
   );
};

const Dot = () => {
   return (
      <span className="!aspect-square h-[5px] w-[5px] shrink-0 grow-0 rounded-full bg-white/20" />
   );
};

Seperator.Dot = Dot;
