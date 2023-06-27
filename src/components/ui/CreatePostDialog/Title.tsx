"use client";

import { useRef } from "react";
import { useTextField, VisuallyHidden } from "react-aria";
import { useCreatePostState } from "./Provider";

export const TitleInput = () => {
   const state = useCreatePostState();
   const ref = useRef<HTMLInputElement>(null);
   const { labelProps, inputProps, descriptionProps, errorMessageProps } =
      useTextField(
         {
            "aria-label": "post title",
            placeholder: "Post Title...",
            autoComplete: "off",
            autoFocus: true,
            onChange: (value) => {
               state.title = value;
            },
         },
         ref
      );

   return (
      <>
         <VisuallyHidden>
            <label {...labelProps}>Post Title</label>
         </VisuallyHidden>
         <input
            {...inputProps}
            className="w-full bg-transparent py-4 pl-3 text-3xl text-white outline-none"
         />
      </>
   );
};
