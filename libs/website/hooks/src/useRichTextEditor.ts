import { Content } from "@tiptap/react";
import { useState, useTransition } from "react";
import { createEditor } from "@website/rich-text-editor";

export const useRichTextEditor = (options: {
   editable?: boolean;
   autofocus?: boolean;
   content?: Content;
}) => {
   const [_pending, transition] = useTransition();
   const [editor] = useState(() =>
      createEditor({
         transition,
         autofocus: options.autofocus,
         editable: options.editable,
         content: options.content,
      })
   );
   return editor;
};
