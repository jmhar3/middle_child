import { Loader, Stack, Text } from "@mantine/core";

function Loading({ message }: { message: string }) {
  return (
    <Stack>
      <Loader color="darkslategray" />
      <Text>{message}</Text>
    </Stack>
  );
}

export default Loading;
