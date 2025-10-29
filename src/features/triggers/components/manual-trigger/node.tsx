import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <>
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="Manual Trigger"
        description="Trigger the workflow manually"
        // onSettings={handleOpenSettings} // TODO: Implement settings logic
        // onDoubleClick={handleDoubleClick} // TODO: Implement double click logic
        // status={nodeStatus} // TODO: Implement status
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
