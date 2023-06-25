"use client"

import * as Toolbar from "~/components/shared/Toolbar";
import { LuBold, LuItalic, LuStrikethrough } from "react-icons/lu";
import { Editor } from "@tiptap/react";
import { Button } from "~/components/shared/Button";

export const Controls = (props: { editor: Editor }) => {
   return (
      <Toolbar.Root dir="ltr" className="flex h-fit items-stretch gap-2 bg-black/60">
         <Toolbar.ToggleGroup
            className="flex items-stretch p-1"
            type="multiple"
            value={[""]}
            onValueChange={() => {}}
         >
            <Toolbar.ToggleItem value="bold" asChild>
               <Button
                  className="rounded-none"
                  onClick={() => {
                     props.editor.chain().focus().toggleBold().run();
                  }}
               >
                  <LuBold className="h-full w-full" />
               </Button>
            </Toolbar.ToggleItem>
            <Toolbar.ToggleItem value="italic" asChild>
               <Button
                  className="rounded-none"
                  onClick={() => {
                     props.editor.chain().focus().toggleItalic().run();
                  }}
               >
                  <LuItalic className="h-full w-full" />
               </Button>
            </Toolbar.ToggleItem>
            <Toolbar.ToggleItem value="srike-through" asChild>
               <Button
                  className="rounded-none"
                  onClick={() => {
                     props.editor.chain().focus().setStrike();
                  }}
               >
                  <LuStrikethrough className="h-full w-full" />
               </Button>
            </Toolbar.ToggleItem>
         </Toolbar.ToggleGroup>
      </Toolbar.Root>
   );
};
