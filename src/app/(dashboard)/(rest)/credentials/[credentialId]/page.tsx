import { requireAuth } from "@/lib/auth-utils";

interface CredentialDetailPageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const CredentialDetailPage = async ({ params }: CredentialDetailPageProps) => {
  const { credentialId } = await params;
  await requireAuth();
  return <div>CredentialDetailPage: {credentialId}</div>;
};

export default CredentialDetailPage;
