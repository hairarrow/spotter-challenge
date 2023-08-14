import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getApiUrl } from "~/utils/api";

interface UniqueRecord {
  id: number;
}

export interface Act extends UniqueRecord {
  name: string;
}

export interface Beat extends UniqueRecord {
  name: string;
  time: string;
  content: string;
  cameraAngle: string;
  notes: string;
}

export interface ActWithBeats extends Act {
  beats: Beat[];
}

export const actRouter = createTRPCRouter({
  sheet: publicProcedure.query(async () => {
    const actsList = await axios
      .get<Act[]>(getApiUrl("/acts"))
      .then((res) => res.data);
    const actsListWithBeats = await Promise.all(
      actsList.map(async (act) => {
        const beats = await axios
          .get<Beat[]>(getApiUrl(`/acts/${act.id}/beats`))
          .then((res) => res.data);

        return {
          ...act,
          beats,
        };
      })
    );

    return actsListWithBeats as ActWithBeats[];
  }),
  create: publicProcedure
    .input(z.string().min(1).max(255))
    .mutation(async ({ input }) => {
      await axios.post(getApiUrl("/acts"), { name: input });
    }),
  delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    await axios.delete(getApiUrl(`/acts/${input}`));
  }),
});
