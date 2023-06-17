import { init } from '@paralleldrive/cuid2';

export const CUID_LENGTH = 24;
export const cuid = init({
   length: CUID_LENGTH,
}) 