const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      join(
         __dirname,
         // "apps/website/app/**/*"
         "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}"
      ),
      ...createGlobPatternsForDependencies(__dirname),
   ],
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
};
