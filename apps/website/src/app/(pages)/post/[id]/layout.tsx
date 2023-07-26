import { createLayout } from "../../createLayout";
import Image from "next/image";
import banner from "./../../../../../public/nature-bg.jpg";

const Layout = async (props: { children: React.ReactNode, params: { id: string } }) => {

   return createLayout({
      children: props.children,
      pageinfo: null,
      sidebar: null,
      banner: (
         <div className="relative flex h-full items-center justify-center bg-black/10 text-xs">
            <Image
               src={banner}
               alt={"Banner Image"}
               fill
               className="pointer-events-none select-none object-cover"
               draggable="false"
               priority
            />
         </div>
      ),
   });
};

export default Layout; 
