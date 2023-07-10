"use client";

import { IObservableValue, action, observable } from "mobx";
import {
   HTMLInputTypeAttribute,
   PropsWithChildren,
   createContext,
   useContext,
   useState,
} from "react";
import { ZodSchema, z } from "zod";

import { debounce } from "@website/utils";

export const useCreateAccountState = () => {
   const ctx = useContext(CREATE_ACCOUNT_STATE_CONTEXT);
   if (ctx === null) {
      throw new Error("Create Account Dialog State Context was null");
   }
   return ctx;
};

const prepareState = <T,>(options: {
   label: string;
   type: HTMLInputTypeAttribute;
   schema: ZodSchema;
   debounceRate?: number;
}) => {
   let _value = observable.box<T>();
   let _errors = observable.array<string>();

   const validate = debounce(
      action(() => {
         const result = options.schema.safeParse(_value.get());
         console.log("called validate");
         if (!result.success) {
            _errors.replace(result.error.errors.map((error) => error.message));
         } else {
            _errors.replace([]);
         }
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
   validate: () => void;
   label: string;
   type: HTMLInputTypeAttribute;
   readonly errors?: string[];
};

// type StageFieldStates = Record<number, Record<string, FieldState>>;
type FieldStates = {
   handle: FieldState;
   email: FieldState;
   imageFile: FieldState<File>;
   firstName: FieldState;
   lastName: FieldState;
   password: FieldState;
   repeatPassword: FieldState;
};

const CREATE_ACCOUNT_STATE_CONTEXT = createContext<{
   currentStage: IObservableValue<number>;
   fields: FieldStates;
} | null>(null);

const SPECIAL_CHAR_AND_SPACES_REGEX = /^(\d|\w)+$/;
const HANDLE_SCHEMA = z
   .string({ required_error: "Handle is Requied" })
   .nonempty({ message: "Handle is required" })
   .refine(
      (value) => {
         const result = SPECIAL_CHAR_AND_SPACES_REGEX.test(value);
         console.log(value, result);
         return result;
      },
      { message: "Handle must not contain spaces or special characters" }
   );

const EMAIL_SCHEMA = z.string({ required_error: "Email is required" }).email({
   message: "Invalid Email",
});
const TEXT_SCHEMA = z.string({ required_error: "This field is required" });
const PASSWORD_SCHEMA = z
   .string({ required_error: "Password is required" })
   .min(5);
const FILE_SCHEMA = z.custom<File>();

export const Provider = (props: PropsWithChildren) => {
   const currentStage = observable.box<number>(0);
   const [fields] = useState(
      (): FieldStates => ({
         handle: prepareState({
            schema: HANDLE_SCHEMA,
            label: "Handle",
            type: "text",
         }),
         email: prepareState({
            schema: EMAIL_SCHEMA,
            label: "Email",
            type: "email",
         }),
         imageFile: prepareState({
            schema: FILE_SCHEMA,
            label: "Immoooge",
            type: "text",
         }),
         firstName: prepareState({
            schema: TEXT_SCHEMA.nonempty(),
            label: "First Name",
            type: "text",
         }),
         lastName: prepareState({
            schema: TEXT_SCHEMA.optional(),
            label: "Last Name",
            type: "text",
         }),
         password: prepareState({
            schema: PASSWORD_SCHEMA,
            label: "Password",
            type: "password",
         }),
         repeatPassword: prepareState({
            schema: TEXT_SCHEMA,
            label: "Repeat Password",
            type: "password",
         }),
      })
   );

   return (
      <CREATE_ACCOUNT_STATE_CONTEXT.Provider value={{ currentStage, fields }}>
         {props.children}
      </CREATE_ACCOUNT_STATE_CONTEXT.Provider>
   );
};
