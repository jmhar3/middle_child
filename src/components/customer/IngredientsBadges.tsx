import { Badge, Group } from "@mantine/core";
import type { MenuItemType } from "../../helpers/menu";

interface IngredientsBadgesProps {
  menuItem: MenuItemType;
}

function IngredientsBadges({ menuItem }: IngredientsBadgesProps) {
  return (
    <Group gap="2" style={{ overflow: "auto" }}>
      {menuItem.ingredients?.map((ingredient) => (
        <Badge radius="sm" color="red" variant="light" key={menuItem.label}>
          {ingredient.label}
        </Badge>
      ))}
    </Group>
  );
}

export default IngredientsBadges;
