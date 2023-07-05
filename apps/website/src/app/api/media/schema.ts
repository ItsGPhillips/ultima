import { z } from 'zod';

export const MULTI_PART_UPLOAD_CREATE_SCHEMA = z.object({
  id: z.string().nonempty(),
  key: z.string().nonempty(),
});

export const MULTI_PART_UPLOAD_PART_SCHEMA = z.object({
  chunkSize: z.number(),
  maxRetries: z.number(),
  urls: z.string().nonempty().array(),
});

export const MULTI_PART_UPLOAD_COMPLETE_SCHEMA = z.object({});
