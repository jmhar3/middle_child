import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mantine/core";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button onClick={() => loginWithRedirect()}>
      Log In to Earn Loyalty Points
    </Button>
  );
};

export default LoginButton;
