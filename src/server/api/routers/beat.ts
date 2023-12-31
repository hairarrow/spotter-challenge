import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getApiUrl } from "~/utils/api";

const beatSchema = z.object({
  name: z.string().max(255),
  content: z.string().max(255).nullish(),
  cameraAngle: z.string().max(255).nullish(),
  notes: z.string().max(255).nullish(),
  time: z
    .string()
    .refine(
      (value) => {
        // Matches strings like "00:00:00-00:00:00"
        const regex =
          /^(?:(?:[01]?\d|2[0-3]):)?[0-5]?\d:[0-5]\d-(?:(?:[01]?\d|2[0-3]):)?[0-5]?\d:[0-5]\d$/;

        return regex.test(value);
      },
      {
        message: "Invalid time range format",
        path: [], // path is an empty array because we're validating a primitive type, not a nested field
      }
    )
    .nullish(),
});

export const beatRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        ...beatSchema.shape,
        actId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await axios.post(getApiUrl(`/acts/${input.actId}/beats`), {
        name: input.name,
        content: input.content,
        cameraAngle: input.cameraAngle,
        notes: input.notes,
        time: input.time,
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        ...beatSchema.shape,
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await axios.put(getApiUrl(`/acts/beats/${input.id}`), {
        name: input.name,
        content: input.content,
        cameraAngle: input.cameraAngle,
        notes: input.notes,
        time: input.time,
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        actId: z.number(),
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await axios.delete(getApiUrl(`/acts/${input.actId}/beats/${input.id}`));
    }),
});
