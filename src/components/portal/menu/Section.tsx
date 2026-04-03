import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useDisclosure } from "@mantine/hooks";
import { Stack, Divider, Group } from "@mantine/core";

import EditableItem from "./EditableItem";
import StyledButton from "../../StyledButton";
import ItemEditPreview from "./ItemEditPreview";
import ConfirmationModal from "../../ConfirmationModal";
import UpsertSectionModal from "./UpsertSectionModal";
import ReorderDrawer from "./ReorderMenuItemsDrawer";

import type {
  MenuItemType,
  Section as SectionType,
} from "../../../state/menu/menuSlice";

function Section({ section }: { section: SectionType }) {
  const blankMenuItem: MenuItemType = {
    id: uuid(),
    label: "",
    price: 0,
    is_in_stock: true,
    has_long_prep_time: false,
    is_applicable_loyalty_item: false,
    order: section.items.length + 1,
  };

  const [newMenuItem, setNewMenuItem] = useState<MenuItemType | null>(
    section.items.length === 0 ? blankMenuItem : null,
  );

  const [
    showReorderDrawer,
    { open: openReorderDrawer, close: closeReorderDrawer },
  ] = useDisclosure(false);
  const [
    showUpsertSectionModal,
    { open: openUpsertSectionModal, close: closeUpsertSectionModal },
  ] = useDisclosure(false);
  const [
    showEditableMenuItem,
    { open: openEditableMenuItem, close: closeEditableMenuItem },
  ] = useDisclosure(section.items.length === 0);

  const [
    showConfirmDelete,
    { close: closeConfirmDelete, open: openConfirmDelete },
  ] = useDisclosure(false);

  const onCloseEditableItem = () => {
    closeEditableMenuItem();
    setNewMenuItem(null);
  };

  const onDeleteSectionItem = (id: string) => {
    // dispatch(deleteMenuItem(id))
    onCloseEditableItem();
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
            <StyledButton label="Reorder Items" onClick={openReorderDrawer} />

            <StyledButton
              label="Rename Section"
              onClick={openUpsertSectionModal}
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
              showCancelButton={section.items.length > 0}
            />
            <Divider />
          </>
        )}

        {section.items.map((menuItem, index) => (
          <>
            {index > 0 && <Divider />}
            <ItemEditPreview
              menuItem={menuItem}
              onDeleteItem={onDeleteSectionItem}
            />
          </>
        ))}

        {showUpsertSectionModal && (
          <UpsertSectionModal
            isOpen={showUpsertSectionModal}
            onClose={closeUpsertSectionModal}
          />
        )}

        {showReorderDrawer && (
          <ReorderDrawer
            isOpen={showReorderDrawer}
            onClose={closeReorderDrawer}
            label="Menu Items"
            items={section.items}
          />
        )}
      </Stack>
    </>
  );
}

export default Section;
