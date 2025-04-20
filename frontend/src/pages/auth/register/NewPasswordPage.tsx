import { Helmet } from "react-helmet-async";
import { NewPasswordForm } from "@/features/auth/components";

export const NewPasswordPage = () => {
  return (
    <>
      <Helmet>
        <title>Set a new password</title>
      </Helmet>
      <NewPasswordForm />
    </>
  );
};
