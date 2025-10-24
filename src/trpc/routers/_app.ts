import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
    });
  }),
  createWorkflow: protectedProcedure.mutation(async ({ ctx }) => {
    await inngest.send({
      name: "workflow/create",
      data: {
        userId: ctx.auth.user.id,
      },
    });
  }),
  testAi: protectedProcedure.mutation(async ({ ctx }) => {
    await inngest.send({
      name: "execute/ai",
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
