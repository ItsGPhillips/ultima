/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  semi: true,
  tabWidth: 3,
  trailingComma: "es5",
  singleQuote: false,
};

module.exports = config;
