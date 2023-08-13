import axios from "axios";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getApiUrl } from "~/utils/api";

const beatSchema = z.object({
  actId: z.number(),
  name: z.string().min(1).max(255),
  content: z.string().min(1).max(255).optional(),
  cameraAngle: z.string().min(1).max(255).optional(),
  notes: z.string().min(1).max(255).optional(),
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
    .optional(),
});

export const beatRouter = createTRPCRouter({
  create: publicProcedure.input(beatSchema).mutation(async ({ input }) => {
    await axios.post(getApiUrl(`/acts/${input.actId}/beats`), {
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
