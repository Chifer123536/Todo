import { Helmet } from "react-helmet-async";
import { ResetPasswordForm } from "@/features/auth/components";

export const ResetPasswordPage = () => {
  return (
    <>
      <Helmet>
        <title>Reset your password</title>
      </Helmet>
      <ResetPasswordForm />
    </>
  );
};
