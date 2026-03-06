import { useDisclosure } from "@mantine/hooks";

import ListItem from "./ListItem";
import EditableItem from "./EditableItem";

import type { MenuItemType } from "../../../types/menu";

interface EditItemPreviewProps {
  menuItem: MenuItemType;
  onDeleteItem: (id: string) => void;
  onSaveMenuItem: (newMenuItem: MenuItemType) => void;
}

function EditItemPreview(props: EditItemPreviewProps) {
  const { menuItem, onDeleteItem, onSaveMenuItem } = props;

  const [
    showEditableMenuItem,
    { open: openEditableMenuItem, close: closeEditableMenuItem },
  ] = useDisclosure(false);

  return showEditableMenuItem ? (
    <EditableItem
      menuItem={menuItem}
      onSaveMenuItem={(newMenuItem: MenuItemType) => {
        onSaveMenuItem(newMenuItem);
        closeEditableMenuItem();
      }}
      onCancelCreateItem={closeEditableMenuItem}
    />
  ) : (
    <ListItem
      onEditItemClick={openEditableMenuItem}
      onDeleteItemClick={() => onDeleteItem(menuItem.id)}
      menuItem={menuItem}
    />
  );
}

export default EditItemPreview;
