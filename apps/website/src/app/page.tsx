import { appRouter } from "@website/api"

const Page = async () => {
   const caller = appRouter.createCaller({})
   const greeting = await caller.greeting.getGreeting();
   return <>{greeting.message}</>
};

export default Page;
