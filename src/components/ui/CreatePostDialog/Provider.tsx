"use client";

import { Editor } from "@tiptap/react";
import { PropsWithChildren, createContext, useContext } from "react";
import { FileWithPath } from "react-dropzone";
import { useRichTextEditor } from "~/hooks/useRichTextEditor";

import {
   IObservableArray,
   IObservableValue,
   ObservableSet,
   action,
   observable,
} from "mobx";

export type CreatePostState = {
   editor: Editor;
   validate: () => boolean;
   handle: string;
   isValid: IObservableValue<boolean | null>;
   errors: ObservableSet<Errors>;
   files: IObservableArray<{
      id: string;
      file: FileWithPath;
      uploadProgress: number | null;
   }>;
   statusText: IObservableValue<string>;
};

const CREATE_POST_STATE_CONTEXT = createContext<CreatePostState | null>(null);

export const useCreatePostState = (): CreatePostState => {
   const ctx = useContext(CREATE_POST_STATE_CONTEXT);
   if (ctx === null) {
      throw new Error("Create Post Context was null");
   }
   return ctx;
};

export enum Errors {
   TooManyFiles,
   BodyRequired,
}

export const CreatePostStateProvider = (
   props: PropsWithChildren<{ handle: string }>
) => {
   let files = observable.array<CreatePostState["files"][number]>([], {
      deep: true,
      autoBind: true,
   });
   let isValid = observable.box<boolean | null>(null);
   let errors = observable.set<Errors>();
   let statusText = observable.box("");
   const editor = useRichTextEditor({ editable: true });

   const validate = action(() => {
      // reset
      isValid.set(null);
      errors.replace([]);

      // TODO: what should be the max number of files
      if (files.length > 5) {
         isValid.set(false);
         errors.add(Errors.TooManyFiles);
         return false;
      }

      if (files.length > 0) {
         isValid.set(true);
         return true;
      }

      if (editor.getText().trim().length === 0) {
         isValid.set(false);
         errors.add(Errors.BodyRequired);
         return false;
      }

      isValid.set(true);
      return true;
   });

   return (
      <CREATE_POST_STATE_CONTEXT.Provider
         value={{
            editor,
            errors,
            files,
            handle: props.handle,
            isValid,
            statusText,
            validate,
         }}
      >
         {props.children}
      </CREATE_POST_STATE_CONTEXT.Provider>
   );
};