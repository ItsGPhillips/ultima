"use client";

import { Dialog } from "@website/components/shared";

const Page = () => {
   return (
      <Dialog.Provider modal defaultOpen>
         <Dialog.Content>
            <div className="bg-white w-[600px] h-[600px]">
               TEST
            </div>
         </Dialog.Content>
      </Dialog.Provider>
   );
};

export default Page;
