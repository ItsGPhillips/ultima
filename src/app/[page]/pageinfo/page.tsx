type PageContext = {
   params: {
      page: string[];
   };
};

const Page = (props: PageContext) => {
   return <div className="text-white">PageInfo {props.params.page[1]}</div>;
};

export default Page;
