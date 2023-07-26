//@ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

// HACK: how to avoid relative path for this??
// const { env } = await import("../../libs/website/env/src/index.js");

const { env } = await import("../../libs/website/env/src/index.mjs");

import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { composePlugins, withNx } from "@nx/next";

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
   experimental: {
      appDir: true,
      // @ts-ignore WithNxOptions doesn't define this yet
      serverActions: true,
   },
   images: {
      domains: [env.NEXT_PUBLIC_CLOUDFLARE_STORAGE_DOMAIN],
   },
   nx: {
      // Set this to true if you would like to use SVGR
      // See: https://github.com/gregberge/svgr
      svgr: false,
   },
   // webpack: (config) => {
   //    config.resolve.plugins.push(
   //       new TsconfigPathsPlugin({
   //          configFile: "apps/website/tsconfig.json",
   //          extensions: ["ts", "tsx", "js", "jsx", "mjs"],
   //       })
   //    );
   //    return config;
   // },
};

const plugins = [
   // Add more Next.js plugins to this list if needed.
   withNx,
];

export default composePlugins(...plugins)(nextConfig);
