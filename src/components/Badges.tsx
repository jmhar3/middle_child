import { ActionIcon, Badge, Flex, Group, Stack, Text } from "@mantine/core";
import EditIcon from "../icons/EditIcon";

interface BadgesProps {
  label: string;
  badges: { id: string; label: string; color?: string }[];
  onEditBadges?: () => void;
}

function Badges({ label, badges, onEditBadges }: BadgesProps) {
  return (
    <Stack gap="6" w="100%">
      <Flex gap="sm">
        <Text>{label}</Text>
        {onEditBadges && (
          <ActionIcon color="darkslategray" onClick={onEditBadges}>
            <EditIcon />
          </ActionIcon>
        )}
      </Flex>

      <Group gap="6" style={{ overflow: "auto" }}>
        {badges.map((badge) => (
          <Badge
            radius="sm"
            color={badge.color ? badge.color : "darkslategray"}
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
