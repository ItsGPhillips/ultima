/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from "react";
import type { AriaListBoxOptions } from "@react-aria/listbox";
import type { ListState } from "react-stately";
import type { Node } from "@react-types/shared";
import { useListBox, useListBoxSection, useOption } from "react-aria";
import { HiCheck } from "react-icons/hi";

interface ListBoxProps extends AriaListBoxOptions<unknown> {
   listBoxRef?: React.RefObject<HTMLUListElement>;
   state: ListState<unknown>;
}

interface SectionProps {
   section: Node<unknown>;
   state: ListState<unknown>;
}

interface OptionProps {
   item: Node<unknown>;
   state: ListState<unknown>;
}

export function ListBox(props: ListBoxProps) {
   let ref = React.useRef<HTMLUListElement>(null);
   let { listBoxRef = ref, state } = props;
   let { listBoxProps } = useListBox(props, state, listBoxRef);

   return (
      <ul
         {...listBoxProps}
         ref={listBoxRef}
         className="flex w-full"
      >
         {[...state.collection].map((item) =>
            item.type === "section" ? (
               <ListBoxSection key={item.key} section={item} state={state} />
            ) : (
               <Option key={item.key} item={item} state={state} />
            )
         )}
      </ul>
   );
}

function ListBoxSection({ section, state }: SectionProps) {
   let { itemProps, headingProps, groupProps } = useListBoxSection({
      heading: section.rendered,
      "aria-label": section["aria-label"],
   });

   return (
      <>
         <li {...itemProps} className="pt-2">
            {section.rendered && (
               <span
                  {...headingProps}
                  className="mx-3 text-xs font-bold uppercase text-gray-500"
               >
                  {section.rendered}
               </span>
            )}
            <ul {...groupProps}>
               {[...section.childNodes].map((node) => (
                  <Option key={node.key} item={node} state={state} />
               ))}
            </ul>
         </li>
      </>
   );
}

function Option({ item, state }: OptionProps) {
   let ref = React.useRef<HTMLLIElement>(null);
   let { optionProps, isDisabled, isSelected, isFocused } = useOption(
      {
         key: item.key,
      },
      state,
      ref
   );

   let text = "text-gray-700";
   if (isFocused || isSelected) {
      text = "text-pink-600";
   } else if (isDisabled) {
      text = "text-gray-200";
   }

   return (
      <li
         {...optionProps}
         ref={ref}
         className={`w-20 border-2 flex cursor-default items-center justify-center rounded-md px-2 py-2 text-sm outline-none ${text} ${
            isFocused ? "bg-pink-100" : ""
         } ${isSelected ? "font-bold" : ""}`}
      >
         {item.rendered}
      </li>
   );
}
