import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useDisclosure } from "@mantine/hooks";
import { Box, Text, Stack, Divider, Accordion, Group } from "@mantine/core";

import EditableItem from "./EditableItem";
import StyledButton from "../../StyledButton";
import ItemEditPreview from "./ItemEditPreview";
import ConfirmationModal from "../../ConfirmationModal";
import UpsertSectionModal from "./UpsertSectionModal";

import type { Section as SectionType } from "../../../state/menu/menuSlice";

// to be removed
import type { MenuItemType } from "../../../types/menu";

const blankMenuItem = {
  id: uuid(),
  label: "",
  price: 0,
};

function Section({ section }: { section: SectionType }) {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(section.items);
  const [newMenuItem, setNewMenuItem] = useState<MenuItemType | null>(
    menuItems.length === 0 ? blankMenuItem : null,
  );

  const [
    showUpsertSectionModal,
    { open: openUpsertSectionModal, close: closeUpsertSectionModal },
  ] = useDisclosure(false);

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
    <Accordion.Item key={section.label} value={section.label}>
      <Accordion.Control>
        <Text component="span">{section.label.toUpperCase()}</Text>
      </Accordion.Control>

      <Accordion.Panel>
        <ConfirmationModal
          label={section.label}
          isOpen={showConfirmDelete}
          onClose={closeConfirmDelete}
          onConfirmDelete={closeConfirmDelete}
        />
        <UpsertSectionModal
          section={section}
          isOpen={showUpsertSectionModal}
          onClose={closeUpsertSectionModal}
        />

        <Stack gap="0">
          <Box p="sm">
            <Group grow p="sm" gap="sm" w="100%" bdrs="sm" bg="whitesmoke">
              <StyledButton
                label="Add Menu Item"
                onClick={() => {
                  openEditableMenuItem();
                  setNewMenuItem(blankMenuItem);
                }}
              />

              <StyledButton
                label="Rename Section"
                onClick={openUpsertSectionModal}
              />

              <StyledButton
                label="Delete Section"
                onClick={openConfirmDelete}
              />
            </Group>
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
                <ItemEditPreview
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
