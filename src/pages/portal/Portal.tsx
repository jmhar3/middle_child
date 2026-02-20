import { Stack, Title } from "@mantine/core";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import NavButton from "../../components/NavButton";
import dayjs from "dayjs";
import { useMemo } from "react";

function Portal() {
  const greeting = useMemo(() => {
    const hour = dayjs().hour();
    return hour < 12 ? "Good Morning" : "Good Afternoon";
  }, []);

  return (
    <Stack p="sm">
      <Title>{greeting}</Title>
      <NavButton label="Edit Menu" path="/portal/menu" />
      <NavButton label="Take Orders" path="/portal/orders" />
      <NavButton label="View Stats" path="/portal/stats" />
    </Stack>
  );
}

export default Portal;

// const ProtectedPortal = withAuthenticationRequired(Portal);

// export default ProtectedPortal;
