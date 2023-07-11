import Image from "next/image";

import logo from "./logo.svg";
import Link from "next/link";

export const Logo = () => {
   return (
      <Link href={"/"}>
         <div className="relative flex h-full w-full items-center justify-center p-2">
            <Image
               src={logo}
               alt={"Ultima Logo"}
               className="aspect-auto w-full bg-transparent"
            />
         </div>
      </Link>
   );
};
