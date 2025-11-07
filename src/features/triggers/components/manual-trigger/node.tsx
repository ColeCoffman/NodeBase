import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchManualTriggerRealtimeToken } from "./actions";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenSettings = () => setOpen(true);
  const status = useNodeStatus({
    nodeId: props.id,
    channel: manualTriggerChannel().name,
    topic: "status",
    refreshToken: fetchManualTriggerRealtimeToken,
  });
  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="Manual Trigger"
        description="Trigger the workflow manually"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={status}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
