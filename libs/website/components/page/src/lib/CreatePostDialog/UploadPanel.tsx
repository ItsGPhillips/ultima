"use client";

import { motion, stagger, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useCreatePostState } from "./Provider";
import Image from "next/image";
import { mergeProps, useButton } from "react-aria";
import { AriaButton } from "@website/components/shared";
import { IoMdImages, IoMdAdd } from "react-icons/io";
import { cn } from "@website/utils";
import { action } from "mobx";
import { observer } from "mobx-react-lite";

const FileDropMessage = () => {
   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{
            duration: 0.2,
         }}
         className="text-md pointer-events-none absolute inset-0 flex cursor-pointer select-none items-center justify-center gap-2 text-white/50"
      >
         Drop your images here or click to browse.
         <IoMdImages className="scale-125" />
      </motion.div>
   );
};

export const UploadFilesPanel = observer(() => {
   const state = useCreatePostState();
   const dropzone = useDropzone({
      useFsAccessApi: true,
      noClick: true,
      onDrop: action((acceptedFiles: FileWithPath[]) => {
         for (const file of acceptedFiles) {
            state.files.push({
               id: String(Math.random()),
               file,
               uploadProgress: null,
            });
         }
      }),
   });

   const ref = useRef<HTMLDivElement>(null);
   const { buttonProps } = useButton(
      {
         onPress() {
            dropzone.open();
         },
      },
      ref
   );
   return (
      <div
         className={cn(
            "relative flex h-16 shrink-0 cursor-pointer items-center gap-1 rounded-xl border-2 border-dashed border-white/20 p-1 transition-colors",
            dropzone.isDragActive ? "border-blue-400 bg-black/20" : ""
         )}
         {...mergeProps(dropzone.getRootProps(), buttonProps)}
      >
         <input {...dropzone.getInputProps()} />
         <AnimatePresence>
            {state.files.length === 0 ? <FileDropMessage /> : <AddMoreButton />}
         </AnimatePresence>
         <UploadPanel />
      </div>
   );
});

const AddMoreButton = () => {
   return (
      <div className="flex h-12 w-12 items-center justify-center">
         <IoMdAdd className="scale-110" />
      </div>
   );
};

const UploadPanel = observer(() => {
   const state = useCreatePostState();
   const loadInStagger = stagger(0.1, { startDelay: 0.2 });
   return (
      <AnimatePresence mode="popLayout">
         {state.files.map(({ file, id }, idx) => {
            return (
               <motion.span
                  layout
                  key={id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{
                     opacity: 1,
                     x: 0,
                     transition: {
                        duration: 0.4,
                        bounce: false,
                        delay: loadInStagger(idx, state.files.length),
                     },
                  }}
                  exit={{
                     opacity: 0,
                     scale: 0.8,
                     transition: { duration: 0.2 },
                  }}
                  className="aspect-square h-full"
               >
                  <ImageDisplay key={id} id={id} file={file} />
               </motion.span>
            );
         })}
      </AnimatePresence>
   );
});

const ImageDisplay = observer((props: { id: string; file: FileWithPath }) => {
   const state = useCreatePostState();
   const [url, setUrl] = useState<string>("/image-placeholder.jpg");
   useEffect(() => {
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
         const data = event.target?.result ?? null;
         if (typeof data === "string") {
            setUrl(data);
         }
      });
      reader.readAsDataURL(props.file);
   }, []);
   return (
      <AriaButton
         onPress={action(() => {
            const idx = state.files.findIndex(({ id }) => id === props.id);
            // state.files is an observable. It can be mutated in place and
            // updates will be visible to observers.
            state.files.splice(idx, 1);
         })}
         className="relative aspect-square h-full overflow-hidden rounded-xl"
      >
         <Image
            src={url}
            alt=""
            fill
            className="object-cover"
            blurDataURL="/image-placeholder.jpg"
         />
      </AriaButton>
   );
});
