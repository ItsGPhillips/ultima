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
  },
  plugins: [],
} satisfies Config;
