"use client";

import { Editor } from "@tiptap/react";
import {
   PropsWithChildren,
   createContext,
   useCallback,
   useContext,
   useState,
   useTransition,
} from "react";
import { z } from "zod";

import { createEditor } from "~/hooks/useRichTextEditor";

export type CreatePostState = {
   title: string;
   body: Editor | null;
   validate: () => boolean;
   handle: string;
   isValid: boolean | null;
   errors: string[];
};

const POST_INPUT_VALIDATOR = z.object({
   title: z
      .string({ required_error: "Posts must have a title" })
      .min(1, { message: "Title is required " })
      .max(100, { message: "Title is too long" }),
   body: z.custom<Editor | null>().refine(
      (editor) => {
         if (editor === null) {
            return false;
         }
         return editor.getText().trim().length > 0;
      },
      {
         message: "Invalid post body",
      }
   ),
});

const CREATE_POST_STATE_CONTEXT = createContext<CreatePostState | null>(null);

export const useCreatePostState = (): CreatePostState => {
   const ctx = useContext(CREATE_POST_STATE_CONTEXT);
   if (ctx === null) {
      throw new Error("Create Post Context was null");
   }
   return ctx;
};

export type CreatePostDialogStateProviderProps = PropsWithChildren<{
   handle: string;
}>;

export const CreatePostDialogStateProvider = (
   props: CreatePostDialogStateProviderProps
) => {
   const [title, setTitle] = useState<CreatePostState["title"]>("");

   const [_pending, transition] = useTransition();
   const [body] = useState<CreatePostState["body"]>(() =>
      createEditor({ transition })
   );
   const [isValid, setIsValid] = useState<CreatePostState["isValid"]>(null);
   const [errors, setErrors] = useState<string[]>([]);

   const validate = useCallback((): boolean => {
      const result = POST_INPUT_VALIDATOR.safeParse({
         title,
         body,
      });
      if (!result.success) {
         setErrors(result.error.errors.map((error) => error.message));
      } else {
         setErrors([]);
      }
      setIsValid(result.success);
      return result.success;
   }, [title, body?.getText() ?? ""]);

   const state = new Proxy(
      {
         title,
         body,
         isValid,
         validate,
         errors,
         handle: props.handle,
      },
      {
         set: (_target, property: keyof CreatePostState, value) => {
            if (property === "title") {
               setTitle(value);
               return true;
            }
            console.error(`Do not set ${property}`);
            return false;
         },
      }
   );

   return (
      <CREATE_POST_STATE_CONTEXT.Provider value={state}>
         {props.children}
      </CREATE_POST_STATE_CONTEXT.Provider>
   );
};