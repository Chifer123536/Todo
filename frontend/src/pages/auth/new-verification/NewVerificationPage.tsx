import { Helmet } from "react-helmet-async";
import { NewVerificationForm } from "@/features/auth/components";

export const NewVerificationPage = () => {
  return (
    <>
      <Helmet>
        <title>Email verification</title>
      </Helmet>
      <NewVerificationForm />
    </>
  );
};
