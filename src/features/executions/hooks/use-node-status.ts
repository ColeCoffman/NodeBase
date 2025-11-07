import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";

interface UseNodeStatusOptions {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export function useNodeStatus({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusOptions) {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data?.length) return;

    // Find the latest message for this node in a single pass (O(n) instead of O(n log n))
    const latestMessage = data.reduce<(typeof data)[0] | null>(
      (latest, message) => {
        if (
          message.kind === "data" &&
          message.topic === topic &&
          message.channel === channel &&
          message.data.nodeId === nodeId
        ) {
          if (
            !latest ||
            (latest.kind === "data" &&
              message.createdAt.getTime() > latest.createdAt.getTime())
          ) {
            return message;
          }
        }
        return latest;
      },
      null
    );

    if (latestMessage?.kind === "data") {
      setStatus(latestMessage.data.status as NodeStatus);
    }
  }, [data, nodeId, channel, topic]);

  return status;
}
