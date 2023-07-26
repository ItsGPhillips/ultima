import { cn } from "@website/utils";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFocusRing, VisuallyHidden } from "react-aria";
import { FieldState } from "../input/state";

type InputProps = {
   name: string;
   state: FieldState;
   preInput?: JSX.Element;
   postInput?: JSX.Element;
   labelKind: "hidden" | "placeholder" | "normal";
   placeholder?: string;
};

export const Input = observer((props: InputProps) => {
   const { focusProps, isFocusVisible } = useFocusRing({
      within: true,
      isTextInput: true,
   });
   return (
      <div
         key={`${props.name}-${props.state.label}`}
         className="flex flex-col items-stretch gap-1 p-2"
      >
         {props.labelKind === "hidden" ? (
            <VisuallyHidden>
               <label className="ml-1 text-white/80" htmlFor={props.name}>
                  {props.state.label}
               </label>
            </VisuallyHidden>
         ) : props.labelKind === "normal" ? (
            <label className="ml-1 text-white/80" htmlFor={props.name}>
               {props.state.label}
            </label>
         ) : null}
         <div
            className={cn(
               "flex gap-1 rounded-md border-none bg-black/50 p-2 transition-colors",
               {
                  "outline outline-2 outline-offset-2 outline-blue-400 ":
                     isFocusVisible,
                  "outline-none": !isFocusVisible,
                  "outline outline-2 outline-offset-2 outline-red-400":
                     props.state.errors?.length,
               }
            )}
            {...(focusProps as any)}
         >
            {!!props.preInput && (
               <div
                  className="flex !aspect-square shrink-0 grow items-center justify-center text-white/60"
                  tabIndex={-1}
               >
                  {props.preInput}
               </div>
            )}
            <input
               defaultValue={props.state.value}
               className={cn("w-full bg-transparent text-white outline-none")}
               name={props.name}
               type={props.state.type}
               onChange={action(({ target }) => {
                  props.state.value = target.value;
               })}
               placeholder={
                  !!props.placeholder
                     ? props.placeholder
                     : props.labelKind === "placeholder"
                     ? props.name
                     : undefined
               }
            />
         </div>
         <div>
            {props.state.errors?.map((error) => {
               return (
                  <div key={error} className="p-2 text-sm text-red-500">
                     {error}
                  </div>
               );
            })}
         </div>
      </div>
   );
});