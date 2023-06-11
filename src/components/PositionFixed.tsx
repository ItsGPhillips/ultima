"use client";
import { ComponentProps, forwardRef } from "react";
import useMeasure from "react-use-measure";
import { mergeRefs } from "@react-aria/utils";
import { cn } from "~/utils/cn";

export const PositionFixed = forwardRef<HTMLDivElement, ComponentProps<"div">>(
   ({ className, ...props }, fref) => {
      const [ref, bounds] = useMeasure();
      console.log({ w: bounds.width, height: bounds.height });
      return (
         <div
            ref={mergeRefs(ref, fref)}
            {...props}
            className={cn("relative", className)}
         >
            <div
               className="fixed"
               style={{
                  width: bounds.width,
                  height: bounds.height,
               }}
            >
               <div className="absolute inset-0">{props.children}</div>
            </div>
         </div>
      );
   }
);
