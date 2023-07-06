"use client";

import { api } from "@website/api/client";
import { useEffect, useState } from "react";

const Page = () => {
   const [message, setMessage] = useState("");
   useEffect(() => {
      api.greeting.getGreeting.query().then((data) => setMessage(data.message));
   }, []);

   return <>{message}</>;
};

export default Page;
