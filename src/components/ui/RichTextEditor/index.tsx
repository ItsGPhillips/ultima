"use client";

import { Editor, EditorContent } from "@tiptap/react";
import { Controls } from "./Controls";

export const RichTextEditor = (props: {
   editor: Editor | null;
   className?: string;
}) => {
   return <EditorContent editor={props.editor} className={props.className} />;
};

RichTextEditor.Controls = Controls;
