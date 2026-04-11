import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useDisclosure } from "@mantine/hooks";
import { Stack, Divider, Group } from "@mantine/core";

import EditableItem from "./EditableItem";
import StyledButton from "../../StyledButton";
import ItemEditPreview from "./ItemEditPreview";
import ConfirmationModal from "../../ConfirmationModal";
import UpsertSectionModal from "./UpsertSectionModal";

import type {
  MenuItemType,
  Section as SectionType,
} from "../../../state/menu/menuSlice";
import { useAppDispatch } from "../../../state/hooks";
import { deleteSection } from "../../../state/menu/menuThunks";
import { notifications } from "@mantine/notifications";

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

  const [isDeletingSection, setIsDeletingSection] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState<MenuItemType | null>(
    section.items.length === 0 ? blankMenuItem : null,
  );

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

  const dispatch = useAppDispatch();

  const onCloseEditableItem = () => {
    closeEditableMenuItem();
    setNewMenuItem(null);
  };

  const onDeleteSectionItem = (id: string) => {
    console.log(id);
    // dispatch(deleteMenuItem(id))
    onCloseEditableItem();
  };

  const onConfirmDeleteSection = () => {
    setIsDeletingSection(true);
    closeConfirmDelete();
    dispatch(deleteSection(section.id))
      .then(() => {
        notifications.show({
          withCloseButton: false,
          message: `${section.label} successfully deleted`,
          position: "bottom-right",
          color: "green",
        });
      })
      .catch((error) =>
        notifications.show({
          message: error,
          withCloseButton: false,
          position: "bottom-right",
          color: "red",
        }),
      )
      .finally(() => setIsDeletingSection(true));
  };

  return (
    <Stack gap="sm">
      <Group
        grow
        p="sm"
        gap="sm"
        w="100%"
        bdrs="sm"
        bg="white"
        bd="1px solid lightgray"
      >
        <StyledButton label="Rename Section" onClick={openUpsertSectionModal} />

        <StyledButton
          label="Delete Section"
          onClick={openConfirmDelete}
          isLoading={isDeletingSection}
        />

        <StyledButton
          label="Add New Menu Item"
          onClick={() => {
            openEditableMenuItem();
            setNewMenuItem(blankMenuItem);
          }}
        />
      </Group>

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
          section={section}
          isOpen={showUpsertSectionModal}
          onClose={closeUpsertSectionModal}
        />
      )}

      {showConfirmDelete && (
        <ConfirmationModal
          label={section.label}
          isOpen={showConfirmDelete}
          onClose={closeConfirmDelete}
          onConfirmDelete={onConfirmDeleteSection}
        />
      )}
    </Stack>
  );
}

export default Section;
