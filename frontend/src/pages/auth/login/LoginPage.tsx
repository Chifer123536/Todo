import { Helmet } from "react-helmet-async";
import { LoginForm } from "@/features/auth/components";

export const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Sign in to your account</title>
      </Helmet>
      <LoginForm />
    </>
  );
};
