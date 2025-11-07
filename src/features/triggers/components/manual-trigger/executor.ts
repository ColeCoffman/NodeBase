import type { NodeExecutor } from "@/features/executions/type";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish "Loading" state for manual trigger

  const result = await step.run("manual-trigger", async () => context);

  // TODO: Publish "Success" state for manual trigger

  return result;
};
