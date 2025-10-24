import { requireAuth } from "@/lib/auth-utils";

interface WorkflowDetailPageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

const WorkflowDetailPage = async ({ params }: WorkflowDetailPageProps) => {
  await requireAuth();
  const { workflowId } = await params;
  return <div>WorkflowDetailPage: {workflowId}</div>;
};

export default WorkflowDetailPage;
