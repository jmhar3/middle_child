import { ActionIcon, Badge, Flex, Group, Stack, Text } from "@mantine/core";
import EditIcon from "../icons/EditIcon";

interface BadgesProps {
  label: string;
  badges: { id: string; label: string; color?: string }[];
  onEditBadges?: () => void;
}

function Badges({ label, badges, onEditBadges }: BadgesProps) {
  return (
    <Stack gap="xs" w="100%">
      <Flex gap="sm" align="flex-end">
        {onEditBadges && (
          <ActionIcon color="darkslategray" onClick={onEditBadges}>
            <EditIcon />
          </ActionIcon>
        )}
        <Text fw="600">{label.toUpperCase()}</Text>
      </Flex>

      <Group gap="6" style={{ overflow: "auto" }}>
        {badges.map((badge) => (
          <Badge
            radius="sm"
            color={badge.color ? badge.color : "darkslategray"}
            variant="outline"
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
