import { useAuth0 } from "@auth0/auth0-react";
import { Button, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Button
      fullWidth
      bg="white"
      variant="outline"
      color="darkslategray"
      size={isMobile ? "md" : "xl"}
      onClick={() => loginWithRedirect()}
    >
      Log In to Earn Loyalty Points
    </Button>
  );
};

export default LoginButton;
