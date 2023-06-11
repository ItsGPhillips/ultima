import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

export default {
   content: ["./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extends: defaultTheme,
      colors: {
         ...colors,
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
   plugins: [],
} satisfies Config;
