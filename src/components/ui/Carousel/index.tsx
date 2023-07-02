"use client";

import { mergeRefs, useResizeObserver } from "@react-aria/utils";
import { motion, useMotionTemplate, useSpring } from "framer-motion";
import {
   ComponentPropsWithRef,
   Dispatch,
   SetStateAction,
   cloneElement,
   forwardRef,
   useRef,
   useState,
} from "react";
import { useMove } from "react-aria";
import { cn } from "~/utils/cn";

export type CarouselSlideProps = ComponentPropsWithRef<"div"> & {};
export const Slide = forwardRef<HTMLDivElement, CarouselSlideProps>(
   (props, fref) => {
      return (
         <div ref={fref} {...props} className={cn("", props.className)}>
            {props.children}
         </div>
      );
   }
);

const remapChildren = (
   children: Array<React.ReactElement<CarouselSlideProps>>,
   width: number
) => {
   let childrenAsArray = Array.isArray(children) ? children : [children];
   return childrenAsArray.map((child) => {
      return cloneElement(child, {
         style: {
            ...child.props.style,
            width,
         },
      });
   });
};

export type CarouselContainerProps = ComponentPropsWithRef<"div"> & {
   children: Array<React.ReactElement<CarouselSlideProps>>;
};
export const Root = forwardRef<HTMLDivElement, CarouselContainerProps>(
   (props, fref) => {
      const ref = useRef<HTMLDivElement>(null);
      const [slideIndex, setSlideIndex] = useState(0);

      const [size, setSize] = useState<DOMRect>();
      useResizeObserver<HTMLDivElement>({
         ref,
         onResize() {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            if (rect.width !== size?.width) {
               setSize(rect);
            }
         },
      });

      const children = remapChildren(props.children, size?.width ?? 0);

      return (
         <div
            ref={mergeRefs(ref, fref)}
            {...props}
            className={cn(
               "relative overflow-hidden rounded-xl",
               props.className
            )}
         >
            <Container
               width={size?.width ?? 1}
               slideIndex={slideIndex}
               setSlideIndex={setSlideIndex}
            >
               {children}
            </Container>
         </div>
      );
   }
);

const Container = (props: {
   width: number;
   slideIndex: number;
   setSlideIndex: Dispatch<SetStateAction<number>>;
   children: Array<React.ReactElement<CarouselSlideProps>>;
}) => {
   const numChildren = props.children.length;
   const currentOffset = props.slideIndex * -props.width;
   const dx = useSpring(currentOffset, {
      stiffness: 600,
      damping: 60,
      mass: 2,
   });

   dx.set(currentOffset);

   const accumOffset = useRef<number>(0);

   const { moveProps } = useMove({
      onMove(e) {
         const pos = Math.max(
            Math.min(
               currentOffset + (props.slideIndex === 0 ? 0 : props.width - 1),
               dx.getPrevious() + e.deltaX
            ),
            currentOffset -
               (props.slideIndex === numChildren - 1 ? 0 : props.width + 1)
         );
         accumOffset.current = (pos - currentOffset) / props.width;
         dx.jump(pos);
      },
      onMoveEnd() {
         if (accumOffset.current < -0.4) {
            props.setSlideIndex((current) => (current + 1) % numChildren);
            return;
         }
         if (accumOffset.current > 0.4) {
            props.setSlideIndex((current) => (current - 1) % numChildren);
            return;
         }
         dx.set(currentOffset);
      },
   });

   const transform = useMotionTemplate`translateX(${dx}px)`;

   return (
      <motion.div
         className="absolute flex h-[24rem] items-stretch"
         style={{
            minWidth: props.width,
            transform,
         }}
         {...(moveProps as any)}
      >
         {props.children}
      </motion.div>
   );
};

export const Carousel = Object.assign(Root, { Slide });
