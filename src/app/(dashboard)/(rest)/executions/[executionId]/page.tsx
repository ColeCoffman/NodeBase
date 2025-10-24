import { requireAuth } from "@/lib/auth-utils";

interface ExecutionDetailPageProps {
  params: Promise<{
    executionId: string;
  }>;
}

const ExecutionDetailPage = async ({ params }: ExecutionDetailPageProps) => {
  await requireAuth();
  const { executionId } = await params;
  return <div>ExecutionDetailPage: {executionId}</div>;
};

export default ExecutionDetailPage;
