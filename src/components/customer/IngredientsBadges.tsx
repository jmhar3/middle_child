import { Badge, Group, Stack, Text } from "@mantine/core";

import type { Modifier } from "../../helpers/menu";

interface IngredientsBadgesProps {
  ingredients: Modifier[];
}

function IngredientsBadges({ ingredients }: IngredientsBadgesProps) {
  return (
    <Stack gap="6" w="100%">
      <Text>Ingredients</Text>

      <Group gap="6" style={{ overflow: "auto" }}>
        {ingredients?.map((ingredient) => (
          <Badge
            radius="sm"
            color="darkslategray"
            variant="filled"
            key={ingredient.id}
          >
            {ingredient.label}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
}

export default IngredientsBadges;
