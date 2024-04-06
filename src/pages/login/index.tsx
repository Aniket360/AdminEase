import { AuthPage } from "@refinedev/antd";
import { authCredentials } from "../../Providers";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
