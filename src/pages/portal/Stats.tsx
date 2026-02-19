import { Title, Stack } from "@mantine/core";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

function Stats() {
  return (
    <Stack>
      <Stack>
        <Title>Analytics</Title>
      </Stack>

      <Stack>
        <Title>Reports</Title>
      </Stack>
    </Stack>
  );
}

export default Stats;

// const ProtectedPortal = withAuthenticationRequired(Stats);

// export default ProtectedPortal;
