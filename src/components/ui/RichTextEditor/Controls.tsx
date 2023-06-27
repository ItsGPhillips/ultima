"use client";

import {
   LuAlignCenter,
   LuAlignJustify,
   LuAlignLeft,
   LuAlignRight,
   LuBold,
   LuCode2,
   LuItalic,
   LuStrikethrough,
} from "react-icons/lu";
import { Editor } from "@tiptap/react";
import { AriaButton } from "~/components/shared/Button";
import { cn } from "~/utils/cn";
import { cloneElement } from "react";

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

export const Controls = (props: { editor: Editor }) => {
   return (
      <div className="flex items-stretch rounded-xl bg-black/50 p-1 ">
         <ControlButton
            isActive={props.editor.isActive("bold")}
            onPress={() => {
               props.editor
               props.editor.chain().focus().toggleBold().run();
            }}
         >
            <LuBold />
         </ControlButton>
         <ControlButton
            isActive={props.editor.isActive("italic")}
            onPress={() => {
               props.editor.chain().focus().toggleItalic().run();
            }}
         >
            <LuItalic />
         </ControlButton>
         <ControlButton
            isActive={props.editor.isActive("strike")}
            onPress={() => {
               props.editor.chain().focus().toggleStrike().run();
            }}
         >
            <LuStrikethrough />
         </ControlButton>
         <span className="mx-1 h-6 w-[1px] place-self-center bg-white/20" />
         <ControlButton
            isActive={props.editor.isActive({ textAlign: "start" })}
            onPress={() => {
               props.editor.chain().focus().setTextAlign("start").run();
            }}
         >
            <LuAlignLeft />
         </ControlButton>
         <ControlButton
            isActive={props.editor.isActive({ textAlign: "center" })}
            onPress={() => {
               props.editor.chain().focus().setTextAlign("center").run();
            }}
         >
            <LuAlignCenter />
         </ControlButton>
         <ControlButton
            isActive={props.editor.isActive({ textAlign: "right" })}
            onPress={() => {
               props.editor.chain().focus().setTextAlign("right").run();
            }}
         >
            <LuAlignRight />
         </ControlButton>
         <ControlButton
            isActive={props.editor.isActive({ textAlign: "justify" })}
            onPress={() => {
               props.editor.chain().focus().setTextAlign("justify").run();
            }}
         >
            <LuAlignJustify />
         </ControlButton>
         <span className="mx-1 h-6 w-[1px] place-self-center bg-white/20" />
         <ControlButton
            isActive={props.editor.isActive("codeBlock")}
            onPress={() => {
               props.editor.chain().focus().toggleCodeBlock().run();
            }}
         >
            <LuCode2 />
         </ControlButton>
      </div>
   );
};
