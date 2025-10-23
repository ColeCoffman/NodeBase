import { SignupForm } from "@/features/auth/components/signup-form";
import { requireUnauth } from "@/lib/auth-utils";

const SignupPage = async () => {
  await requireUnauth();
  return (
    <div>
      <SignupForm />
    </div>
  );
};

export default SignupPage;
