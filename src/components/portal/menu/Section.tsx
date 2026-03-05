import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Box, Text, Stack, Divider, Accordion, Group } from "@mantine/core";

import EditableItem from "./EditableItem";
import StyledButton from "../../StyledButton";
import EditableMenuItem from "./ItemEditPreview";
import ConfirmationModal from "../../ConfirmationModal";

import type {
  ItemOptions,
  MenuItemType,
  MenuSection,
  Modifier,
} from "../../../helpers/menu";
import UpsertSectionModal from "./UpsertSectionModal";

interface SectionProps {
  section: MenuSection;
  onDeleteSection: () => void;
  modifierCategories: ItemOptions[];
  modifiers: Modifier[];
  menuLength: number;
}

function Section({
  section,
  onDeleteSection,
  menuLength,
  ...itemProps
}: SectionProps) {
  const blankMenuItem = {
    id: "",
    label: "",
    price: 0,
  };

  const [menuSection, setMenuSection] = useState(section);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(menuSection.items);
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

  const onUpdateSection = (section: MenuSection) => {
    setMenuSection(section);
    closeUpsertSectionModal();
  };

  return (
    <Accordion.Item key={menuSection.label} value={menuSection.label}>
      <Accordion.Control>
        <Text component="span">{menuSection.label.toUpperCase()}</Text>
      </Accordion.Control>

      <Accordion.Panel>
        <ConfirmationModal
          label={menuSection.label}
          isOpen={showConfirmDelete}
          onClose={closeConfirmDelete}
          onConfirmDelete={() => {
            closeConfirmDelete();
            onDeleteSection();
          }}
        />
        <UpsertSectionModal
          section={menuSection}
          isOpen={showUpsertSectionModal}
          onClose={closeUpsertSectionModal}
          onSectionUpsert={onUpdateSection}
          menuLength={menuLength}
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
                  {...itemProps}
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
                  {...itemProps}
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
