import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useDisclosure } from "@mantine/hooks";
import { Stack, Divider, Group, TextInput } from "@mantine/core";

import EditableItem from "./EditableItem";
import StyledButton from "../../StyledButton";
import ItemEditPreview from "./ItemEditPreview";
import ConfirmationModal from "../../ConfirmationModal";

import { selectMenuLength } from "../../../state/menu/menuSlice";
import { upsertSection } from "../../../state/menu/menuThunks";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";

import type {
  MenuItemType,
  Section as SectionType,
} from "../../../state/menu/menuSlice";

const blankMenuItem: MenuItemType = {
  id: uuid(),
  label: "",
  price: 0,
  is_in_stock: true,
  has_long_prep_time: false,
  is_applicable_loyalty_item: false,
};

function Section({ section }: { section: SectionType }) {
  const dispatch = useAppDispatch();
  const menuLength = useAppSelector(selectMenuLength);

  const [sectionLabel, setSectionLabel] = useState(section.label);
  const [isUpdatingSection, setIsUpdatingSection] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(section.items);
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

  const onDeleteItem = (id: string) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
    onCloseEditableItem();
  };

  const onRenameSection = () => {
    const sectionData = section
      ? { ...section, label: sectionLabel }
      : {
          id: uuid(),
          order: menuLength + 1,
          label: sectionLabel,
        };

    setIsUpdatingSection(true);
    dispatch(upsertSection(sectionData)).finally(() => {
      setIsUpdatingSection(false);
    });
  };

  return (
    <>
      <ConfirmationModal
        label={section.label}
        isOpen={showConfirmDelete}
        onClose={closeConfirmDelete}
        onConfirmDelete={closeConfirmDelete}
      />

      <Stack gap="0">
        <Stack pb="sm">
          <Group
            grow
            p="sm"
            gap="sm"
            w="100%"
            bdrs="sm"
            bd="1px solid lightgray"
            bg="white"
          >
            <TextInput
              size="lg"
              value={sectionLabel}
              onChange={(event) => setSectionLabel(event.target.value)}
              disabled={isUpdatingSection}
            />
            <StyledButton
              label="Rename Section"
              onClick={onRenameSection}
              isLoading={isUpdatingSection}
            />

            <StyledButton label="Delete Section" onClick={openConfirmDelete} />
          </Group>

          <StyledButton
            label="Add New Menu Item"
            onClick={() => {
              openEditableMenuItem();
              setNewMenuItem(blankMenuItem);
            }}
          />
        </Stack>

        {newMenuItem && showEditableMenuItem && (
          <>
            <EditableItem
              menuItem={newMenuItem}
              onCloseEditableItem={onCloseEditableItem}
              showCancelButton={menuItems.length > 0}
            />
            <Divider />
          </>
        )}

        {menuItems.map((menuItem, index) => (
          <>
            {index > 0 && <Divider />}
            <ItemEditPreview menuItem={menuItem} onDeleteItem={onDeleteItem} />
          </>
        ))}
      </Stack>
    </>
  );
}

export default Section;
