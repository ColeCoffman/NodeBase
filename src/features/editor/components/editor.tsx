"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

interface EditorProps {
  workflowId: string;
}

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};

export const Editor = ({ workflowId }: EditorProps) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  return <pre>{JSON.stringify(workflow, null, 2)}</pre>;
};
