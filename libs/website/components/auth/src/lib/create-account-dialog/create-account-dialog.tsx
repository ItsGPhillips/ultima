"use client";

import { AriaButton, Dialog } from "@website/components/shared";
import { useCreateAccountState, Provider } from "./provider";
import { observer } from "mobx-react-lite";
import { MdAlternateEmail } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { useButton } from "@react-aria/button";
import {
   AnimatePresence,
   motion,
   useAnimate,
   useMotionValue,
} from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFacebookSquare, FaGoogle, FaTwitter } from "react-icons/fa";
import { BiSolidLockAlt, BiSolidLockOpenAlt } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import Image from "next/image";
import { Input } from "../input/input";
import { AuthEvents } from "../..";

const PageOne = observer(
   (props: { setNextPage: Dispatch<SetStateAction<number>> }) => {
      const state = useCreateAccountState();
      const [aref, animate] = useAnimate();

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
            <div className="ml-auto mt-2 flex gap-2">
               <AriaButton
                  ref={aref}
                  onPress={async () => {
                     const results = await Promise.all([
                        state.fields.handle.validate(),
                        state.fields.email.validate(),
                     ]);

                     if (results.includes(false)) {
                        animate(
                           aref.current,
                           {
                              x: [-4, 4, -4, 0],
                           },
                           {
                              ease: "easeInOut",
                              duration: 0.2,
                           }
                        );
                        return;
                     }

                     props.setNextPage((current) => current + 1);
                  }}
                  className="mx-2 ml-auto mt-auto w-24 border-2 border-blue-400 bg-blue-400/30 text-white"
               >
                  Next
               </AriaButton>
            </div>
         </>
      );
   }
);

const PageTwo = observer(
   (props: { setNextPage: Dispatch<SetStateAction<number>> }) => {
      const state = useCreateAccountState();
      const [aref, animate] = useAnimate();
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
            state.fields.profileImage.value = acceptedFiles[0] as File;
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
            <div className="ml-auto mt-2 flex gap-2">
               <AriaButton
                  onPress={() => {
                     props.setNextPage((current) => current - 1);
                  }}
                  className="mx-2 w-24 border-2 border-neutral-400 bg-neutral-400/30 text-white"
               >
                  Back
               </AriaButton>
               <AriaButton
                  ref={aref}
                  onPress={async () => {
                     const results = await Promise.all([
                        state.fields.firstName.validate(),
                        state.fields.lastName.validate(),
                     ]);

                     if (results.includes(false)) {
                        animate(
                           aref.current,
                           {
                              x: [-4, 4, -4, 0],
                           },
                           {
                              ease: "easeInOut",
                              duration: 0.2,
                           }
                        );
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
      const [aref, animate] = useAnimate();

      return (
         <>
            <div>
               <Input
                  name="Password"
                  state={state.fields.password}
                  labelKind="normal"
                  preInput={<BiSolidLockOpenAlt className="h-5 w-5" />}
               />
               {!!state.fields.repeatPassword && (
                  <Input
                     name="Repeat Password"
                     state={state.fields.repeatPassword}
                     labelKind="placeholder"
                     preInput={<BiSolidLockAlt className="mr-1 h-5 w-5" />}
                  />
               )}
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
                  ref={aref}
                  onPress={async () => {
                     const results = await Promise.all([
                        state.fields.password.validate(),
                        state.fields.repeatPassword?.validate() ?? false,
                     ]);
                     if (results.includes(false)) {
                        animate(
                           aref.current,
                           {
                              x: [-4, 4, -4, 0],
                           },
                           {
                              ease: "easeInOut",
                              duration: 0.2,
                           }
                        );
                        return;
                     }

                     await state.submit().then(() => {
                        props.setNextPage((current) => current + 1);
                     });
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

const PageFour = observer(() => {
   const [aref, animate] = useAnimate();
   const pathLength = useMotionValue(0);

   useEffect(() => {
      pathLength.set(1);
   }, []);

   return (
      <div ref={aref} className="flex h-48 w-full items-center justify-center">
         <motion.div
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1, transition: { delay: 0.4 } }}
            className="flex h-36 w-36 items-center justify-center rounded-full border-2 border-green-400 bg-green-400/20 p-8"
         >
            <BsCheckLg className="h-full w-full" fill="white" />
         </motion.div>
      </div>
   );
});

export const CreateAccountDialog = observer(() => {
   const linkRef = useRef<HTMLSpanElement>(null);
   const { buttonProps } = useButton(
      {
         onPress() {
            window.dispatchEvent(AuthEvents.OPEN_SIGNIN_DIALOG_EVENT);
         },
      },
      linkRef
   );

   const [currentPage, setCurrentPage] = useState(0);
   const pages = [
      <PageOne setNextPage={setCurrentPage} />,
      <PageTwo setNextPage={setCurrentPage} />,
      <PageThree setNextPage={setCurrentPage} />,
      <PageFour />,
   ];

   return (
      <Provider>
         <div className="flex max-h-[75vh] w-[400px] max-w-full flex-col bg-zinc-900 p-4 text-black">
            <div className="flex h-16 w-full shrink-0 items-center justify-center">
               <Dialog.Title className="text-xl font-bold text-white">
                  Create Account
               </Dialog.Title>
            </div>
            <motion.div className="mb-6 shrink-0 px-6">
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

            <div className="flex w-full justify-center text-sm text-white/80">
               <span>
                  Already have an account? Sign in{" "}
                  <span
                     ref={linkRef}
                     className="font-bold italic text-blue-600 hover:cursor-pointer"
                     {...buttonProps}
                  >
                     here
                  </span>
               </span>
            </div>
         </div>
      </Provider>
   );
});
