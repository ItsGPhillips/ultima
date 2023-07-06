import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @param args clsx input paramaters
 * @returns html class names string
 */
export const cn = (...args: Parameters<typeof clsx>): string =>
   twMerge(clsx(...args));

export const css = String.raw;

