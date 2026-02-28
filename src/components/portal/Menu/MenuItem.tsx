import { ActionIcon, Flex, Group, Stack, Text } from "@mantine/core";

import Badges from "../../Badges";
import EditIcon from "../../../icons/EditIcon";

import type { MenuItemType } from "../../../helpers/menu";

interface MenuItemProps {
  onEditItemClick: () => void;
  menuItem: MenuItemType;
}

function MenuItem(props: MenuItemProps) {
  const { onEditItemClick, menuItem } = props;

  return (
    <Flex p="sm" w="100%" gap="lg">
      <Flex gap="sm" miw="12em">
        <ActionIcon onClick={onEditItemClick} color="darkslategray">
          <EditIcon />
        </ActionIcon>

        <Stack gap="0">
          <Text fs="1.4em" fw="600" style={{ textWrap: "nowrap" }}>
            {menuItem.label.toUpperCase()}
          </Text>
          <Text fs="1.4em" fw="600">
            ${menuItem.price.toFixed(2)}
          </Text>
        </Stack>
      </Flex>
      <Group w="100%" justify="space-between" align="flex-start" grow>
        {menuItem.ingredients && (
          <Badges label="Ingredients" badges={menuItem.ingredients} />
        )}

        {menuItem.modifiers && (
          <Badges label="Modifiers" badges={menuItem.modifiers} />
        )}

        {menuItem.modifierCategories && (
          <Badges
            label="Modifier Categories"
            badges={menuItem.modifierCategories}
          />
        )}
      </Group>
    </Flex>
  );
}

export default MenuItem;
