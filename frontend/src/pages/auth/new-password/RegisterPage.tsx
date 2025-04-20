import { Helmet } from "react-helmet-async";
import { RegisterForm } from "@/features/auth/components";

export const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Create an account</title>
      </Helmet>
      <RegisterForm />
    </>
  );
};
