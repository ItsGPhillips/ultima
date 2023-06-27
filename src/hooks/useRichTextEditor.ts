import { Content } from "@tiptap/react";
import { useState, useTransition } from "react";
import { createEditor } from "~/lib/RichTextEditor";

export const useRichTextEditor = (options: {
   editable?: boolean;
   content?: Content;
}) => {
   const [_pending, transition] = useTransition();
   const [editor] = useState(() =>
      createEditor({
         transition,
         editable: options.editable,
         content: options.content,
      })
   );
   return editor;
};
