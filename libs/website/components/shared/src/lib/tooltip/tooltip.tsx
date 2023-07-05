"use client";
import * as TooltipPrimitve from "@radix-ui/react-tooltip";
import { ReactElement } from "react";
import { cn } from "@website/utils";

export const Provider = TooltipPrimitve.Provider;

export type TooltipProps = {
   tooltip: string;
   children: ReactElement<HTMLButtonElement>;
   side?: "bottom" | "top" | "right" | "left";
};
export const Tooltip = (props: TooltipProps) => {
   return (
      <TooltipPrimitve.Root>
         <TooltipPrimitve.Trigger asChild>
            {props.children}
         </TooltipPrimitve.Trigger>
         <TooltipPrimitve.Portal>
            <TooltipPrimitve.Content
               className={cn(
                  "relative z-[9999] select-none rounded-xl bg-zinc-800 px-4 py-3 text-sm leading-none text-white/80 shadow-md shadow-black"
               )}
               sideOffset={5}
               align="center"
               side={props.side}
               avoidCollisions
               collisionPadding={2}
            >
               {props.tooltip}
               <TooltipPrimitve.Arrow className="fill-zinc-800" />
            </TooltipPrimitve.Content>
         </TooltipPrimitve.Portal>
      </TooltipPrimitve.Root>
   );
};
