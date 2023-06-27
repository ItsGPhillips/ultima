import { type Config } from "tailwindcss";

export default {
   content: ["./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         backgroundImage: {
            "gradient-radial": "radial-gradient(var(--gradient-color-stops))",
         },
         screens: {
            sm: "640px",
            md: "1024px",
            lg: "1280px",
            tsm: { max: "769px" },
            tmd: { min: "770px" },
            txl: { min: "1160px" },
         },
      },
   },
   plugins: [],
} satisfies Config;
