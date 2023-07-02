import { init } from "@paralleldrive/cuid2";

export const DATABASE_CUID_LENGTH = 24;
export const cuid = init({
   length: DATABASE_CUID_LENGTH,
});
