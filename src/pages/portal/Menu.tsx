import { Button } from "@mantine/core";
import { withAuthenticationRequired } from "@auth0/auth0-react";

function Menu() {
  return <Button>Open Store</Button>;
}

const ProtectedPortal = withAuthenticationRequired(Menu);

export default ProtectedPortal;
