import { Badge, Group, Stack, Text } from "@mantine/core";

interface BadgesProps {
  label: string;
  badges: { id: string; label: string }[];
}

function Badges({ label, badges }: BadgesProps) {
  return (
    <Stack gap="6" w="100%">
      <Text>{label}</Text>

      <Group gap="6" style={{ overflow: "auto" }}>
        {badges.map((badge) => (
          <Badge
            radius="sm"
            color="darkslategray"
            variant="filled"
            key={badge.id}
          >
            {badge.label}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
}

export default Badges;
