"use client";

import { AriaButton } from "~/components/shared/Button";
import { useCreatePostState } from "./Provider";
import { createPostAction } from "~/server/actions/post";
import { useTransition } from "react";
import superjson from "superjson";
import { Dialog } from "~/components/shared/Dialog";
import { useDialogState } from "~/components/shared/Dialog/Provider";
import { motion, useAnimate } from "framer-motion";
import { cn } from "~/utils/cn";
import { mergeRefs } from "@react-aria/utils";
import { Spinner } from "~/components/shared/Spinner";

//TODO put this somewhere to reuse
const MotionAriaButton = motion(AriaButton);

// const SpinnThing = (props: { bounds: RectReadOnly }) => {
//    const ref = useRef<SVGSVGElement>(null);
//    const path = d3.path();
//    const THICKNESS = 4;
//    const RADIUS = Math.max(
//       0,
//       Math.min(props.bounds.width, props.bounds.height) / 2 - THICKNESS
//    );

//    const tl: [number, number] = [RADIUS + THICKNESS, 0 + THICKNESS];
//    const tr: [number, number] = [
//       props.bounds.width - RADIUS - THICKNESS,
//       0 + THICKNESS,
//    ];
//    const br: [number, number] = [
//       0 + RADIUS + THICKNESS,
//       props.bounds.height - THICKNESS,
//    ];
//    path.moveTo(tl[0], tl[1]);
//    path.lineTo(tr[0], tr[1]);
//    path.arc(
//       tr[0],
//       tr[1] + RADIUS,
//       RADIUS,
//       (3 * Math.PI) / 2,
//       Math.PI / 2,
//       false
//    );
//    path.lineTo(br[0], br[1]);
//    path.arc(
//       tl[0],
//       tr[1] + RADIUS,
//       RADIUS,
//       Math.PI / 2,
//       (3 * Math.PI) / 2,
//       false
//    );
//    path.closePath();
//    const d = path.toString();

//    return (
//       <motion.svg
//          ref={ref}
//          className="absolute inset-0 border-[1px] bg-transparent"
//          viewBox={`0 0 ${props.bounds.width} ${props.bounds.height}`}
//       >
//          <motion.path
//             initial={{ pathLength: 0 }}
//             animate={{ pathLength: 1, transition: { delay: 1 } }}
//             d={d}
//             stroke="red"
//             strokeWidth={2}
//          />
//       </motion.svg>
//    );
// };

const SubmitPostButton = () => {
   const [aref, animate] = useAnimate();
   const dialog = useDialogState();
   const state = useCreatePostState();
   const [pending, transition] = useTransition();

   return (
      <MotionAriaButton
         ref={mergeRefs(aref)}
         isDisabled={pending}
         className={cn(
            "relative h-10 w-32 select-none border-2 border-green-400 bg-green-400/20 px-2 py-1 hover:bg-green-400/25"
         )}
         onPress={() => {
            if (state.validate()) {
               transition(async () => {
                  try {
                     await new Promise((res) => setTimeout(res, 2000));
                     await createPostAction({
                        handle: state.handle,
                        title: state.title,
                        body: superjson.serialize(state.body!.getJSON()),
                     });
                  } catch (e) {
                     console.error(e);
                  } finally {
                     dialog.isOpen = false;
                     return;
                  }
               });
            } else {
               animate(
                  aref.current,
                  {
                     filter: ["saturate(10%)", "saturate(100%)"],
                  },
                  {
                     ease: "easeIn",
                     duration: 0.3,
                  }
               );
               animate(
                  aref.current,
                  {
                     x: [-4, 4, -4, 0],
                  },
                  {
                     ease: "easeInOut",
                     duration: 0.2,
                  }
               );
            }
         }}
      >
         {pending ? <Spinner /> : "Create Post"}
      </MotionAriaButton>
   );
};

export const Controls = () => {
   return (
      <div className="flex h-16 items-center justify-end gap-4">
         <SubmitPostButton />
         <Dialog.Close asChild>
            <MotionAriaButton className="h-10 w-24 select-none border-2 border-white/40 bg-white/20 py-1 hover:bg-white/25">
               Close
            </MotionAriaButton>
         </Dialog.Close>
      </div>
   );
};
