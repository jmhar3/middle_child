import { Title, Stack } from "@mantine/core";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import PageLayout from "./PageLayout";

function Stats() {
  return (
    <PageLayout>
      <Stack>
        <Stack>
          <Title>Analytics</Title>
        </Stack>

        <Stack>
          <Title>Reports</Title>
        </Stack>
      </Stack>
    </PageLayout>
  );
}

export default Stats;

// const ProtectedPortal = withAuthenticationRequired(Stats);

// export default ProtectedPortal;
