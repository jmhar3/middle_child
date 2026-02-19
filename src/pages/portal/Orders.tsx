import { Button, Stack } from "@mantine/core";
import { withAuthenticationRequired } from "@auth0/auth0-react";

import Nav from "../../components/portal/Nav";

function Orders() {
  return (
    <Stack>
      <Nav>
        <Stack dir="row" gap={2}>
          <Button variant="outlined">Update Stock</Button>
          <Button variant="contained">Close Store</Button>
        </Stack>
      </Nav>
    </Stack>
  );
}

const ProtectedPortal = withAuthenticationRequired(Orders);

export default ProtectedPortal;
