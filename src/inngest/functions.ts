import { prisma } from "@/lib/db";
import { inngest } from "./client";

export const createWorkflow = inngest.createFunction(
  { id: "workflow/create" },
  { event: "workflow/create" },
  async ({ event, step }) => {
    await step.run("create-workflow", async () => {
      if (!event.data.userId) {
        throw new Error("User ID is required to create a workflow");
      }

      await prisma.workflow.create({
        data: {
          name: "workflow-from-inngest",
          description: "Workflow created from inngest",
          userId: event.data.userId,
        },
      });
      return { message: `Workflow created!`, success: true };
    });
  }
);
