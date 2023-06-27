import path from "path";
import { fileURLToPath } from "url";
// import babelPluginMacros from "babel-plugin-macros";
// import pluginSyntaxPlugin from "@babel/plugin-syntax-typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The folders containing files importing twin.macro
const includedDirs = [path.resolve(__dirname, "src")];

/**
 * @param {import("next").NextConfig} nextConfig
 * @returns {import("next").NextConfig}
 */
export function withTwin(nextConfig) {
   return {
      ...nextConfig,
      webpack(config, options) {
         const { dev, isServer } = options;
         config.module = config.module || {};
         config.module.rules = config.module.rules || [];
         config.module.rules.push({
            test: /\.(tsx|ts)$/,
            include: includedDirs,
            use: [
               options.defaultLoaders.babel,
               {
                  loader: "babel-loader",
                  options: {
                     sourceMaps: dev,
                     plugins: [
                        ["babel-plugin-macros"],
                        ["@babel/plugin-syntax-typescript", { isTSX: true }],
                     ],
                  },
               },
            ],
         });

         if (!isServer) {
            config.resolve.fallback = {
               ...(config.resolve.fallback || {}),
               fs: false,
               module: false,
               path: false,
               os: false,
               crypto: false,
            };
         }

         if (typeof nextConfig.webpack === "function") {
            return nextConfig.webpack(config, options);
         } else {
            return config;
         }
      },
   };
}
