"use client";

import { faker } from "@faker-js/faker";
import { useTransition } from "react";
import { Button } from "~/components/shared/Button";
import { cuid } from "~/utils/cuid";
import { motion } from "framer-motion";
import { cn } from "~/utils/cn";
import { RouterInputs, trpc } from "~/utils/trpc";

const Spinner = () => {
   return (
      <motion.svg
         viewBox="0 0 100 100"
         className="aspect-square h-full"
         animate={{
            rotateZ: [0, 360],
            transition: {
               duration: 1.2 * 3,
               repeat: Infinity,
            },
         }}
      >
         <circle
            cx="50"
            cy="50"
            r="42"
            strokeWidth={"0.75rem"}
            className="overflow-visible fill-transparent stroke-white/50"
         />
         <motion.circle
            cx="50"
            cy="50"
            r="42"
            strokeWidth={"0.6rem"}
            className="overflow-visible fill-transparent stroke-neutral-50"
            initial={{}}
            animate={{
               rotate: [0, 360],
               pathLength: [0.2, 0.5, 0.2],
               transition: {
                  repeat: Infinity,
                  ease: "easeInOut",
                  duration: 1.2,
               },
            }}
         />
      </motion.svg>
   );
};

export type NewPostButtonProps = {
   groupId: string;
   userId?: string;
};

const DisabledPostButton = () => {
   return (
      <Button
         className={cn(
            "h-8 w-32 border-2 border-orange-400 bg-orange-400/50 grayscale"
         )}
         isDisabled
      >
         Create Post
      </Button>
   );
};

export const CreatePostButton = (props: NewPostButtonProps) => {
   const { mutate: addPost, isLoading } = trpc.pages.addPost.useMutation();

   const createPostData = () => {
      return {
         groupId: props.groupId,
         title: faker.lorem.sentence(),
         body: faker.lorem.paragraphs(),
      } satisfies RouterInputs["pages"]["addPost"];
   };

   if (props.userId === undefined) {
      return <DisabledPostButton />;
   }

   return (
      <Button
         onPress={() => {
            addPost(createPostData());
         }}
         className={cn("h-9 w-32 border-2 border-orange-400 bg-orange-400/50")}
         isDisabled={isLoading}
      >
         {isLoading ? <Spinner /> : "Create Post"}
      </Button>
   );
};
