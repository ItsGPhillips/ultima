"use client";

import { faker } from "@faker-js/faker";
import { useTransition } from "react";
import { Button } from "~/components/shared/Button";
import { cn } from "~/utils/cn";
import { createPost } from "~/server/actions/post";
import { Spinner } from "~/components/shared/Spinner";

export type NewPostButtonProps = {
   handle: string;
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
   const [isLoading, transition] = useTransition();
   
   if (props.handle === undefined) {
      return <DisabledPostButton />;
   }

   return (
      <Button
         onPress={() => {
            transition(async () => {
               await createPost({
                  handle: props.handle,
                  title: faker.lorem.sentence(),
                  body: faker.lorem.paragraphs(),
               });
            });
         }}
         className={cn("h-9 w-32 border-2 border-orange-400 bg-orange-400/50")}
         isDisabled={isLoading}
      >
         {isLoading ? <Spinner /> : "Create Post"}
      </Button>
   );
};
