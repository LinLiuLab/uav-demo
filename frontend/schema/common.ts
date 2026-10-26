import { z } from "zod";

export const recordSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string(),
});

export type DemoRecord = z.infer<typeof recordSchema>;

export function responseSchema<T extends z.ZodTypeAny>(data: T) {
  return z.object({ code: z.literal(0), message: z.string(), data });
}
