import { debounceAsync } from "@website/utils";
import { observable, action } from "mobx";
import { HTMLInputTypeAttribute } from "react";
import { ZodSchema } from "zod";

export const prepareState = <T,>(options: {
   label: string;
   type: HTMLInputTypeAttribute;
   schema: ZodSchema;
   debounceRate?: number;
}) => {
   let _value = observable.box<T>();
   let _errors = observable.array<string>();

   const validate = debounceAsync(
      action(() => {
         const result = options.schema.safeParse(_value.get());
         console.log("called validate");
         if (!result.success) {
            _errors.replace(result.error.errors.map((error) => error.message));
         } else {
            _errors.replace([]);
         }
         return result.success;
      }),
      options.debounceRate
   );

   return {
      get value(): T | undefined {
         return _value.get();
      },
      set value(value: T) {
         _value.set(value);
         validate();
      },
      get errors(): string[] | undefined {
         return _errors;
      },
      validate,
      type: options.type,
      label: options.label,
   };
};

export type FieldState<Data = string> = {
   value?: Data;
   validate: () => Promise<boolean>;
   label: string;
   type: HTMLInputTypeAttribute;
   readonly errors?: string[];
};