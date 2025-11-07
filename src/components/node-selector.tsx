"use client";

import { NodeType } from "@/generated/prisma/enums";
import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Manual Trigger",
    description: "Trigger the workflow manually",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form Trigger",
    description: "Trigger the workflow when a Google Form is submitted",
    icon: "/logos/googleform.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make an HTTP request",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const NodeSelector = ({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      // Check if the node is already in the flow
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER
        );
        if (hasManualTrigger) {
          toast.error("A manual trigger node already exists in the workflow");
          return;
        }
      }
      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL
        );
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          type: selection.type,
          position: flowPosition,
          data: {},
        };

        if (hasInitialTrigger) return [newNode];

        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [setNodes, getNodes, screenToFlowPosition, onOpenChange]
  );
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add a node</SheetTitle>
          <SheetDescription>
            Select a node to add to your workflow
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          {triggerNodes.map((node) => (
            <div
              key={node.type}
              className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
              onClick={() => handleNodeSelect(node)}
            >
              <div className="flex items-center gap-6 w-full overflow-hidden">
                {typeof node.icon === "string" ? (
                  <Image
                    src={node.icon}
                    alt={node.label}
                    className="object-contain rounded-sm"
                    width={20}
                    height={20}
                  />
                ) : (
                  <node.icon className="size-5" />
                )}
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{node.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {node.description}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          {executionNodes.map((node) => (
            <div
              key={node.type}
              className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
              onClick={() => handleNodeSelect(node)}
            >
              <div className="flex items-center gap-6 w-full overflow-hidden">
                {typeof node.icon === "string" ? (
                  <Image
                    src={node.icon}
                    alt={node.label}
                    className="object-contain rounded-sm"
                    width={20}
                    height={20}
                  />
                ) : (
                  <node.icon className="size-5" />
                )}
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{node.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {node.description}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
