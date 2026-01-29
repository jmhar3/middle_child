import { Badge, Group } from "@mantine/core";

import type { Modifier } from "../../helpers/menu";

interface IngredientsBadgesProps {
  ingredients: Modifier[];
}

function IngredientsBadges({ ingredients }: IngredientsBadgesProps) {
  return (
    <Group gap="2" style={{ overflow: "auto" }}>
      {ingredients?.map((ingredient) => (
        <Badge radius="sm" color="red" variant="light" key={ingredient.id}>
          {ingredient.label}
        </Badge>
      ))}
    </Group>
  );
}

export default IngredientsBadges;
