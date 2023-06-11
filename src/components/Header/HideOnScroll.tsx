"use client";

import { Portal } from "@radix-ui/react-portal";
import { useScroll, useMotionValueEvent, useAnimate } from "framer-motion";
import {
   ComponentPropsWithRef,
   forwardRef,
   useEffect,
   useRef,
   useState,
} from "react";
import useMeasure from "react-use-measure";

import { mergeRefs } from "@react-aria/utils";
import theme from "tailwindcss/defaultTheme";

export const HideOnScroll = forwardRef<
   HTMLDivElement,
   ComponentPropsWithRef<"div">
>((props, fref) => {
   const [ref, animate] = useAnimate();
   const { scrollY } = useScroll();
   const [isScrolledEnough, setIsScrolledEnough] = useState(false);

   const isHiding = useRef(false);

   useMotionValueEvent(scrollY, "change", () => {
      // TODO (George): uncomment this and see if its worth it.
      // if (scrollY.get() == 0) {
      //    animate(
      //       ref.current,
      //       { height: theme.spacing["20"] },
      //       {
      //          ease: "linear",
      //          duration: 0.1,
      //          bounce: 0,
      //       }
      //    );
      // } else if (isHiding.current) {
      //    if (!isScrolledEnough) return;
      //    animate(
      //       ref.current,
      //       { height: theme.spacing["12"] },
      //       {
      //          ease: "linear",
      //          duration: 0.1,
      //          bounce: 0,
      //       }
      //    );
      // }

      if (!isScrolledEnough) return;

      if (scrollY.get() > scrollY.getPrevious()) {
         // Hide
         if (!isHiding.current) {
            isHiding.current = true;
            animate(
               ref.current,
               {
                  y: "-100%",
               },
               {
                  ease: "linear",
                  duration: 0.2,
                  bounce: 0,
               }
            );
         }
      } else {
         // Show
         if (isHiding.current) {
            isHiding.current = false;
            animate(
               ref.current,
               {
                  y: "0%",
               },
               {
                  ease: "linear",
                  duration: 0.1,
                  bounce: 0,
               }
            );
         }
      }
   });

   const [portal, setPortal] = useState<HTMLElement | null>(null);
   useEffect(() => {
      setPortal(() =>
         document.querySelector("[data-header-scroll-handle=true]")
      );
   }, []);

   return (
      <div ref={mergeRefs(ref, fref)} {...props}>
         <Portal container={portal}>
            <OffsetAnouncer setIsScrolledEnough={setIsScrolledEnough} />
         </Portal>
         {props.children}
      </div>
   );
});

/**
 * This element is inserted into the dom via a portal and will set a flag to
 * true when its been scrolled off screen.
 */
const OffsetAnouncer: React.FC<{
   setIsScrolledEnough: (value: boolean) => void;
}> = (props) => {
   const [ref, bounds] = useMeasure({ scroll: true });

   useEffect(() => {
      props.setIsScrolledEnough(bounds.top <= 0);
   }, [bounds.top]);

   return <span ref={ref} className="block" />;
};

/**
 * The Header component will find this span and insert a child element that
 * will anounce its position.
 */
export const HeaderScrollHandle = () => {
   return <span className="block w-full" data-header-scroll-handle />;
};
