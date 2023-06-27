//=============================================================

import { LanguageFn } from "highlight.js";
import { Content, Editor } from "@tiptap/react";
import { TransitionStartFunction } from "react";
import { CODE_BLOCK_DATA_ATTR, extensions } from "./extensions";
import { lowlight } from "lowlight/lib/core";

export const createEditor = (options: {
   transition: TransitionStartFunction;
   editable?: boolean;
   content?: Content;
}) => {
   return new Editor({
      editable: options.editable,
      editorProps: {
         handleKeyDown: (view, event) => {
            if (event.key === "Tab") {
               event.preventDefault();
               view.pasteText("\t");
            }
            return false;
         },
      },
      onCreate({ editor }) {
         options.transition(async () => {
            await registerLowlightHighlights({
               root: editor.view.nodeDOM(0)?.parentElement ?? null,
               CODE_BLOCK_DATA_ATTR,
            });
         });
      },

      onUpdate({ editor }) {
         const root = editor.view.nodeDOM(0)?.parentElement ?? null;
         options.transition(async () => {
            await registerLowlightHighlights({
               root,
               CODE_BLOCK_DATA_ATTR,
            });
         });
      },
      extensions: extensions(),
      content: options.content,
   });
};

const registerLowlightHighlights = async (options: {
   root: Element | null;
   CODE_BLOCK_DATA_ATTR: string;
}) => {
   for (const element of options.root?.querySelectorAll(
      `[${options.CODE_BLOCK_DATA_ATTR}=true]`
   ) ?? []) {
      const classList = element.firstElementChild?.classList.values();
      for (const classStr of classList ?? []) {
         for (const l of LANGUAGES) {
            if (l.classes.includes(classStr)) {
               console.log(`Running ${l.classes} Loader`);
               l.loader(lowlight);
            }
         }
      }
   }
};

const createLanguageLoader = (options: {
   name: string;
   aliases?: string[];
   moduleFn: () => Promise<{ default: LanguageFn }>;
}) => {
   const aliases = options.aliases ?? [];
   return {
      classes: [options.name, ...aliases].map(
         (name) => `language-${name.trim()}`
      ),
      loader: async (ll: typeof lowlight) => {
         if (!ll.registered(options.name)) {
            const module = await options.moduleFn();
            ll.registerLanguage(options.name, module.default);
            for (const alias of aliases) {
               ll.registerAlias(options.name, alias);
            }
         }
      },
   };
};

const LANGUAGES = [
   //TODO (George) Add more langauages?
   createLanguageLoader({
      name: "javascript",
      aliases: ["js", "es6", "ECMAScript"],
      moduleFn: async () => import("highlight.js/lib/languages/javascript"),
   }),
   createLanguageLoader({
      name: "css",
      moduleFn: async () => import("highlight.js/lib/languages/css"),
   }),
   createLanguageLoader({
      name: "xml",
      aliases: ["html"],
      moduleFn: async () => import("highlight.js/lib/languages/xml"),
   }),
   createLanguageLoader({
      name: "typescript",
      aliases: ["ts"],
      moduleFn: async () => import("highlight.js/lib/languages/typescript"),
   }),
   createLanguageLoader({
      name: "cpp",
      moduleFn: async () => import("highlight.js/lib/languages/cpp"),
   }),
   createLanguageLoader({
      name: "c",
      moduleFn: async () => import("highlight.js/lib/languages/c"),
   }),
   createLanguageLoader({
      name: "rust",
      moduleFn: async () => import("highlight.js/lib/languages/rust"),
   }),
   createLanguageLoader({
      name: "bash",
      aliases: ["shell"],
      moduleFn: async () => import("highlight.js/lib/languages/bash"),
   }),
];
