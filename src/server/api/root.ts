import { actRouter } from "~/server/api/routers/act";
import { beatRouter } from "~/server/api/routers/beat";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  act: actRouter,
  beat: beatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
