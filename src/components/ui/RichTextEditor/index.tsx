"use client";

import { Editor, EditorContent } from "@tiptap/react";
import { Controls } from "./Controls";

export const RichTextEditor = (props: { editor: Editor | null }) => {
   return (
      <EditorContent
         editor={props.editor}
         className="w-full bg-black/20 p-2 caret-white"
         onChange={() => {
            console.log("changed");
         }}
      />
   );
};

RichTextEditor.Controls = Controls;
