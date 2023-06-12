import type { OverlayTriggerState } from "react-stately";
import type { AriaPopoverProps } from "@react-aria/overlays";
import * as React from "react";
import { usePopover, DismissButton, Overlay } from "@react-aria/overlays";

import { useLockedBody, useOnClickOutside } from "usehooks-ts";
import { useIsomorphicLayoutEffect } from "framer-motion";

interface PopoverProps extends Omit<AriaPopoverProps, "popoverRef"> {
   children: React.ReactNode;
   state: OverlayTriggerState;
   className?: string;
   popoverRef?: React.RefObject<HTMLDivElement>;
}

export function Popover(props: PopoverProps) {
   let ref = React.useRef<HTMLDivElement>(null);
   let { popoverRef = ref, state, children, className, isNonModal } = props;

   let { popoverProps, underlayProps } = usePopover(
      {
         ...props,
         popoverRef,
      },
      state
   );

   useLockedBody(true);

   useOnClickOutside(popoverRef, () => {
      state.setOpen(false);
   });

   return (
      <Overlay portalContainer={props.triggerRef.current ?? undefined}>
         <div
            {...popoverProps}
            ref={popoverRef}
            className={`z-10 mt-2 rounded-md border border-gray-300 bg-white shadow-lg ${className}`}
         >
            {children}
            <DismissButton onDismiss={state.close} />
         </div>
      </Overlay>
   );
}
