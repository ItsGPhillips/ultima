
export type LayoutContext = {
   children: React.ReactNode;
   pageinfo: React.ReactNode;
   pagebanner: React.ReactNode;
   params: {
      page: string[];
   };
};

export type PageContext = {
   params: {
      id: string;
   };
};
