import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";
import { GoogleFormTriggerDialog } from "./dialog";

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenSettings = () => setOpen(true);
  const status = useNodeStatus({
    nodeId: props.id,
    channel: googleFormTriggerChannel().name,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });
  return (
    <>
      <GoogleFormTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logos/googleform.svg"
        name="Google Form"
        description="When a form is submitted"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={status}
      />
    </>
  );
});

GoogleFormTrigger.displayName = "GoogleFormTrigger";
