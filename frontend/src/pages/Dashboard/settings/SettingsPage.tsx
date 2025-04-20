import { Helmet } from "react-helmet-async";
import { SettingsForm } from "@/features/user/components/SettingsForm";

export const SettingsPage = () => {
  return (
    <>
      <Helmet>
        <title>Profile settings</title>
      </Helmet>
      <SettingsForm />
    </>
  );
};
