import { getExecutor } from "@/features/executions/lib/executor-registry";
import prisma from "@/lib/db";
import { NonRetriableError } from "inngest";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { inngest } from "./client";
import { topologicalSort } from "./utils";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries: 0 }, // TODO: Remove for production
  {
    event: "workflows/execute.workflow",
    channels: [httpRequestChannel(), manualTriggerChannel()],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is required");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: { nodes: true, connections: true },
      });
      return topologicalSort(workflow.nodes, workflow.connections);
    });

    // Initialize the context with any initial data from the trigger
    let context = event.data.initialData || {};

    // Execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    return { workflowId, result: context };
  }
);
