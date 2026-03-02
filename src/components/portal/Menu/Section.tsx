import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Box, Flex, Text, Stack, Divider, Accordion } from "@mantine/core";

import EditableItem from "./EditableItem";
import StyledButton from "../../StyledButton";
import EditableMenuItem from "./ItemEditPreview";
import ConfirmationModal from "../../ConfirmationModal";
import EditableMenuSectionModifier from "./EditableSectionModifier";

import { modifierCategories, modifiers } from "../../../helpers/menu";

import type { MenuItemType, MenuSection } from "../../../helpers/menu";

interface SectionProps {
  section: MenuSection;
  onDeleteSection: () => void;
}

function Section(props: SectionProps) {
  const {
    section: { label, items, defaultModifiers, defaultModifierCategories },
    onDeleteSection,
  } = props;

  const blankMenuItem = {
    id: "",
    label: "",
    price: 0,
    modifiers: defaultModifiers,
    modifierCategories: defaultModifierCategories,
  };

  const [menuItems, setMenuItems] = useState<MenuItemType[]>(items);
  const [newMenuItem, setNewMenuItem] = useState<MenuItemType | null>(
    menuItems.length === 0 ? blankMenuItem : null,
  );

  const [
    showEditableMenuItem,
    { open: openEditableMenuItem, close: closeEditableMenuItem },
  ] = useDisclosure(menuItems.length === 0);

  const [
    showConfirmDelete,
    { close: closeConfirmDelete, open: openConfirmDelete },
  ] = useDisclosure(false);

  const onCloseEditableItem = () => {
    closeEditableMenuItem();
    setNewMenuItem(null);
  };

  const onSaveMenuItem = (newMenuItem: MenuItemType) => {
    if (newMenuItem.id.length === 0) {
      setMenuItems((prevMenuItems) => [...prevMenuItems, newMenuItem]);
    } else {
      setMenuItems((prevMenuItems) =>
        prevMenuItems.map((item) =>
          item.id === newMenuItem.id ? newMenuItem : item,
        ),
      );
    }
    onCloseEditableItem();
  };

  const onDeleteItem = (id: string) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
    onCloseEditableItem();
  };

  return (
    <Accordion.Item key={label} value={label}>
      <Accordion.Control>
        <Text component="span">{label.toUpperCase()}</Text>
      </Accordion.Control>

      <Accordion.Panel>
        <Stack gap="0">
          <Box p="sm" pb="0">
            <Flex
              p="sm"
              gap="sm"
              w="100%"
              align="flex-end"
              justify="space-between"
              bd="darkslategray 1px solid"
              bdrs="sm"
            >
              <Stack w="100%">
                <EditableMenuSectionModifier
                  label="DEFAULT MODIFIERS"
                  defaultValue={["3", "4"]}
                  data={modifiers.map((category) => ({
                    value: category.id,
                    label: category.label,
                  }))}
                />

                <Divider />

                <EditableMenuSectionModifier
                  label="DEFAULT MODIFIER CATEGORIES"
                  defaultValue={["3", "4"]}
                  data={modifierCategories.map((category) => ({
                    value: category.id,
                    label: category.label,
                  }))}
                />
              </Stack>

              <Flex gap="sm" justify="flex-end" h="100%">
                <Divider orientation="vertical" />

                <Stack>
                  <StyledButton
                    label="Delete Section"
                    onClick={openConfirmDelete}
                  />

                  <ConfirmationModal
                    label={label}
                    isOpen={showConfirmDelete}
                    onClose={closeConfirmDelete}
                    onConfirmDelete={() => {
                      closeConfirmDelete();
                      onDeleteSection();
                    }}
                  />

                  <StyledButton
                    label="Add Menu Item"
                    onClick={() => {
                      openEditableMenuItem();
                      setNewMenuItem(blankMenuItem);
                    }}
                  />
                </Stack>
              </Flex>
            </Flex>
          </Box>

          <Stack gap="0">
            {newMenuItem && showEditableMenuItem && (
              <>
                <EditableItem
                  menuItem={newMenuItem}
                  onSaveMenuItem={onSaveMenuItem}
                  onCancelCreateItem={onCloseEditableItem}
                  showCancelButton={menuItems.length > 0}
                />
                <Divider />
              </>
            )}

            {menuItems.map((menuItem, index) => (
              <>
                {index > 0 && <Divider />}
                <EditableMenuItem
                  menuItem={menuItem}
                  onSaveMenuItem={onSaveMenuItem}
                  onDeleteItem={onDeleteItem}
                />
              </>
            ))}
          </Stack>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default Section;
