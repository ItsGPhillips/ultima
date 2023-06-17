"use client"

import * as React from "react";
import type { AriaSelectProps } from "@react-types/select";
import { useSelectState } from "react-stately";
import {
   useSelect,
   HiddenSelect,
   useButton,
   mergeProps,
   useFocusRing,
} from "react-aria";

import { ListBox } from "./ListBox";
import { cn } from "~/utils/cn";
import { useOnClickOutside } from "usehooks-ts";
import { useRef } from "react";

export { Item } from "react-stately";

export function Select<T extends object>(props: AriaSelectProps<T>) {
   // Create state based on the incoming props
   let state = useSelectState(props);

   // Get props for child elements from useSelect
   let ref = React.useRef(null);
   let { triggerProps, valueProps, menuProps } = useSelect(props, state, ref);

   // Get props for the button based on the trigger props from useSelect
   let { buttonProps } = useButton(triggerProps, ref);
   let { focusProps, isFocusVisible } = useFocusRing();

   const menuRef = useRef<HTMLDivElement>(null);
   useOnClickOutside(menuRef, () => {
      state.setOpen(false);
   });

   return (
      <div className=" flex-col">
         <HiddenSelect
            state={state}
            triggerRef={ref}
            label={props.label}
            name={props.name}
         />
         <button
            {...mergeProps(buttonProps, focusProps)}
            ref={ref}
            className={cn(
               "w-24 rounded-full border-2 px-4 py-1 outline-none hover:bg-white/5",
               isFocusVisible ? "border-blue-400" : "border-white/10",
               state.isOpen ? "bg-black/30" : ""
            )}
         >
            <span {...valueProps} className="text-sm">
               {state.selectedItem.rendered}
            </span>
         </button>
         {state.isOpen && (
            <div
               ref={menuRef}
               className="absolute mt-2 rounded-lg bg-white p-2"
            >
               <ListBox {...menuProps} state={state} />
            </div>
         )}
      </div>
   );
}
