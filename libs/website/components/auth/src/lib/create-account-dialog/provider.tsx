"use client";

import { IObservableValue, observable } from "mobx";
import {
   PropsWithChildren,
   createContext,
   useContext,
   useState,
} from "react";
import { z } from "zod";

import { api } from "@website/api/client";
import { FieldState, prepareState } from "../input/state";

export const useCreateAccountState = () => {
   const ctx = useContext(CREATE_ACCOUNT_STATE_CONTEXT);
   if (ctx === null) {
      throw new Error("Create Account Dialog State Context was null");
   }
   return ctx;
};

export type FieldStates = {
   handle: FieldState;
   email: FieldState;
   profileImage: FieldState<File>;
   firstName: FieldState;
   lastName: FieldState;
   password: FieldState;
   repeatPassword?: FieldState;
};

const CREATE_ACCOUNT_STATE_CONTEXT = createContext<{
   currentStage: IObservableValue<number>;
   fields: FieldStates;
   submit: () => Promise<void>;
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
         profileImage: prepareState({
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
      })
   );

   fields.repeatPassword = prepareState({
      schema: z.string().refine(
         (value) => {
            return fields.password.value === value;
         },
         { message: "Passwords don't match" }
      ),
      label: "Repeat Password",
      type: "password",
   });

   const submit = async () => {
      const results = await Promise.all(
         Object.values(fields).map(({ validate }) => validate())
      );
      if (results.includes(false)) {
         // TODO: toasts.
         throw new Error("Fields didn't pass validation");
      }

      await api.auth.create.mutate({
         id: "email",
         accentColor: "#ffffff",
         email: fields.email.value!,
         handle: fields.handle.value!,
         firstName: fields.firstName.value!,
         lastName: fields.lastName.value ?? null,
         password: fields.password.value!,
      });
   };

   return (
      <CREATE_ACCOUNT_STATE_CONTEXT.Provider
         value={{ currentStage, fields, submit }}
      >
         {props.children}
      </CREATE_ACCOUNT_STATE_CONTEXT.Provider>
   );
};
