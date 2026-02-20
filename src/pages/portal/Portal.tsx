import { Stack } from "@mantine/core";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import NavButton from "../../components/NavButton";

function Portal() {
  return (
    <Stack>
      <NavButton label="Edit Menu" path="/portal/menu" />
      <NavButton label="Take Orders" path="/portal/orders" />
      <NavButton label="View Stats" path="/portal/stats" />
    </Stack>
  );
}

export default Portal;

// const ProtectedPortal = withAuthenticationRequired(Portal);

// export default ProtectedPortal;
