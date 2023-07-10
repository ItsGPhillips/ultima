"use client";

import { LuBold, LuCode2, LuItalic, LuStrikethrough } from "react-icons/lu";
import { AriaButton } from "@website/components/shared";
import { cn } from "@website/utils";
import { cloneElement } from "react";
import { useCreatePostState } from "../CreatePostDialog/Provider";
import { observer } from "mobx-react-lite";

const ControlButton = (props: {
   isActive: boolean;
   onPress: () => void;
   children: JSX.Element;
}) => {
   return (
      <AriaButton
         className={cn(
            "relative h-8 w-8 cursor-pointer rounded-md",
            props.isActive
               ? "border-2 border-blue-400 bg-blue-400/30"
               : "hover:bg-white/20"
         )}
         onPress={props.onPress}
      >
         {cloneElement(props.children, {
            className: cn(
               props.children.props.className,
               "absolute aspect-square inset-0 m-auto flex items-center justify-center"
            ),
         })}
      </AriaButton>
   );
};

export const Controls = observer(() => {
   const state = useCreatePostState();
   const editor = state.editor;
   if (editor === null) {
      return null;
   }

   return (
      <div className="flex items-stretch rounded-xl bg-black/50 p-1 ">
         <ControlButton
            isActive={editor.isActive("bold")}
            onPress={() => {
               editor.chain().focus().toggleBold().run();
            }}
         >
            <LuBold />
         </ControlButton>
         <ControlButton
            isActive={editor.isActive("italic")}
            onPress={() => {
               editor.chain().focus().toggleItalic().run();
            }}
         >
            <LuItalic />
         </ControlButton>
         <ControlButton
            isActive={editor.isActive("strike")}
            onPress={() => {
               editor.chain().focus().toggleStrike().run();
            }}
         >
            <LuStrikethrough />
         </ControlButton>
         <span className="mx-1 h-6 w-[1px] place-self-center bg-white/20" />
         <ControlButton
            isActive={editor.isActive("codeBlock")}
            onPress={() => {
               editor.chain().focus().toggleCodeBlock().run();
            }}
         >
            <LuCode2 />
         </ControlButton>
      </div>
   );
});
