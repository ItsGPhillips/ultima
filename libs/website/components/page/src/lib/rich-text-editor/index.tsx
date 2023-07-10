"use client";

import { EditorContent } from "@tiptap/react";
import { useCreatePostState } from "../CreatePostDialog/Provider";
import { observer } from "mobx-react-lite";

export const RichTextEditor = observer((props: { className?: string }) => {
   const state = useCreatePostState();
   return (
      <div className="relative overflow-hidden rounded-xl">
         <EditorContent editor={state.editor} className={props.className} />
      </div>
   );
});