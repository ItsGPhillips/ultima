"use client";

import Link from "next/link";
import { ComponentProps, cloneElement } from "react";
import { cn } from "~/utils/cn";

export type ChanneLinkProps = {
   children: [
      React.ReactElement<ComponentProps<"span">>,
      React.ReactElement<any>,
   ];
};

export const ChanneLink: React.FC<ChanneLinkProps> = (props) => {
   const [label, picon] = props.children;

   const icon = cloneElement(picon, { className: cn(picon.props["className"], "mx-4")}) 
   return (
      <Link href="#" className="flex items-center gap-2 p-1 justify-end bg-white/5 w-full rounded-md hover:bg-white/10">
         {label}
         {icon}
      </Link>
   );
};
