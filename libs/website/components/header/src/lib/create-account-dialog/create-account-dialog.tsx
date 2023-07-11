"use client";

import { AriaButton, Dialog } from "@website/components/shared";
import { type FieldState, useCreateAccountState } from "./provider";
import { observer } from "mobx-react-lite";
import { action } from "mobx";
import { VisuallyHidden, useFocusRing } from "react-aria";
import { cn } from "@website/utils";
import { MdAlternateEmail } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFacebookSquare, FaGoogle, FaTwitter } from "react-icons/fa";
import { BiSolidLockAlt, BiSolidLockOpenAlt } from "react-icons/bi";
import Image from "next/image";

type InputProps = {
   name: string;
   state: FieldState;
   preInput?: JSX.Element;
   postInput?: JSX.Element;
   labelKind: "hidden" | "placeholder" | "normal";
   placeholder?: string;
};

const Input = observer((props: InputProps) => {
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
         <motion.div layout="position">
            {props.state.errors?.map((error) => {
               return (
                  <div key={error} className="p-2 text-sm text-red-500">
                     {error}
                  </div>
               );
            })}
         </motion.div>
      </div>
   );
});

const PageOne = observer(
   (props: { setNextPage: Dispatch<SetStateAction<number>> }) => {
      const state = useCreateAccountState();
      return (
         <>
            <div className="relative flex select-none items-center justify-center gap-2 text-white/10">
               <div className="aspect-square p-2">
                  <FaFacebookSquare className="h-8 w-8" />
               </div>
               <div className="aspect-square p-2">
                  <FaGoogle className="h-8 w-8" />
               </div>
               <div className="aspect-square p-2">
                  <FaTwitter className="h-8 w-8" />
               </div>
               <div className="absolute inset-0 flex items-center justify-center text-white shadow-black drop-shadow-lg">
                  Coming Soon!
               </div>
            </div>
            <div>
               <Input
                  name="Handle"
                  state={state.fields.handle}
                  labelKind="normal"
                  preInput={<MdAlternateEmail className="h-5 w-5" />}
               />
               <Input
                  name="Email"
                  state={state.fields.email}
                  labelKind="normal"
                  preInput={<HiOutlineMail className="mr-1 h-5 w-5" />}
               />
            </div>

            <AriaButton
               onPress={() => {
                  state.fields.handle.validate();
                  state.fields.email.validate();

                  console.log(state.fields.handle.errors);
                  console.log(state.fields.email.errors);

                  if (state.fields.handle.errors?.length ?? 0 !== 0) {
                     return;
                  }
                  if (state.fields.email.errors?.length ?? 0 !== 0) {
                     return;
                  }

                  props.setNextPage((current) => current + 1);
               }}
               className="mx-2 ml-auto mt-auto w-24 border-2 border-blue-400 bg-blue-400/30 text-white"
            >
               Next
            </AriaButton>
         </>
      );
   }
);

const PageTwo = observer(
   (props: { setNextPage: Dispatch<SetStateAction<number>> }) => {
      const state = useCreateAccountState();

      const [imageUrl, setImageUrl] = useState<string>();

      const dz = useDropzone({
         onDrop(acceptedFiles) {
            if (acceptedFiles.length > 1) {
               throw new Error("todo");
            }
            if (!acceptedFiles[0]) return;

            const reader = new FileReader();
            reader.addEventListener("load", (event) => {
               const data = event.target?.result ?? null;
               if (typeof data === "string") {
                  setImageUrl(data);
               }
            });
            reader.readAsDataURL(acceptedFiles[0]);
            state.fields.imageFile.value = acceptedFiles[0] as File;
         },
      });

      return (
         <>
            <div>
               <div>
                  <div
                     {...dz.getRootProps()}
                     className="flex items-center justify-center"
                  >
                     <input {...dz.getInputProps()} />
                     <div className="relative h-40 w-40 overflow-hidden rounded-xl">
                        <Image
                           src={imageUrl ?? "/image-placeholder.jpeg"}
                           alt=""
                           fill
                           className="object-cover"
                           blurDataURL="/image-placeholder.jpg"
                        />
                     </div>
                  </div>
               </div>
               <Input
                  name="First Name"
                  state={state.fields.firstName}
                  labelKind="normal"
               />
               <Input
                  name="Last Name"
                  state={state.fields.lastName}
                  labelKind="normal"
               />
            </div>
            <div className="ml-auto flex gap-2">
               <AriaButton
                  onPress={() => {
                     props.setNextPage((current) => current - 1);
                  }}
                  className="mx-2 w-24 border-2 border-neutral-400 bg-neutral-400/30 text-white"
               >
                  Back
               </AriaButton>
               <AriaButton
                  onPress={() => {
                     state.fields.firstName.validate();
                     state.fields.lastName.validate();

                     console.log(state.fields.firstName.errors);
                     console.log(state.fields.lastName.errors);

                     if (state.fields.firstName.errors?.length ?? 0 !== 0) {
                        return;
                     }
                     if (state.fields.lastName.errors?.length ?? 0 !== 0) {
                        return;
                     }

                     props.setNextPage((current) => current + 1);
                  }}
                  className="mx-2 w-24 border-2 border-blue-400 bg-blue-400/30 text-white"
               >
                  Next
               </AriaButton>
            </div>
         </>
      );
   }
);

const PageThree = observer(
   (props: { setNextPage: Dispatch<SetStateAction<number>> }) => {
      const state = useCreateAccountState();

      return (
         <>
            <div>
               <Input
                  name="Password"
                  state={state.fields.password}
                  labelKind="normal"
                  preInput={<BiSolidLockOpenAlt className="h-5 w-5" />}
               />
               <Input
                  name="Repeat Password"
                  state={state.fields.repeatPassword}
                  labelKind="placeholder"
                  preInput={<BiSolidLockAlt className="mr-1 h-5 w-5" />}
               />
            </div>
            <div className="ml-auto flex gap-2">
               <AriaButton
                  onPress={() => {
                     props.setNextPage((current) => current - 1);
                  }}
                  className="mx-2 w-24 border-2 border-neutral-400 bg-neutral-400/30 text-white"
               >
                  Back
               </AriaButton>
               <AriaButton
                  onPress={() => {
                     state.fields.password.validate();
                     state.fields.repeatPassword.validate();

                     console.log(state.fields.password.errors);
                     console.log(state.fields.repeatPassword.errors);

                     if (state.fields.password.errors?.length ?? 0 !== 0) {
                        return;
                     }
                     if (
                        state.fields.repeatPassword.errors?.length ??
                        0 !== 0
                     ) {
                        return;
                     }

                     props.setNextPage((current) => current + 1);
                  }}
                  className="mx-2 whitespace-nowrap border-2 border-green-400 bg-green-400/30 px-4 text-white"
               >
                  Create Account
               </AriaButton>
            </div>
         </>
      );
   }
);

export const CreateAccountDialog = observer(() => {
   const [currentPage, setCurrentPage] = useState(0);
   const pages = [
      <PageOne setNextPage={setCurrentPage} />,
      <PageTwo setNextPage={setCurrentPage} />,
      <PageThree setNextPage={setCurrentPage} />,
   ];

   return (
      <motion.div
         layout
         layoutRoot
         className="flex max-h-[75vh] w-[400px] flex-col bg-zinc-900 p-2 text-black max-w-full"
      >
         <div className="flex h-16 w-full items-center justify-center shrink-0">
            <Dialog.Title className="text-xl font-bold text-white">
               Create Account
            </Dialog.Title>
         </div>
         <motion.div layout className="mb-6 px-6 shrink-0">
            <AnimatePresence mode="wait" initial={false}>
               <motion.div
                  key={currentPage}
                  className="items-s flex h-full flex-col justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                     bounce: false,
                     ease: "easeOut",
                     duration: 0.2,
                  }}
               >
                  {pages[currentPage]}
               </motion.div>
            </AnimatePresence>
         </motion.div>
      </motion.div>
   );
});
