import { useDisclosure } from "@mantine/hooks";

import ListItem from "./ListItem";
import EditableItem from "./EditableItem";

import type {
  ItemOptions,
  MenuItemType,
  Modifier,
} from "../../../helpers/menu";

interface EditItemPreviewProps {
  menuItem: MenuItemType;
  onDeleteItem: (id: string) => void;
  onSaveMenuItem: (newMenuItem: MenuItemType) => void;
  modifierCategories: ItemOptions[];
  modifiers: Modifier[];
}

function EditItemPreview(props: EditItemPreviewProps) {
  const { menuItem, onDeleteItem, onSaveMenuItem } = props;

  const [
    showEditableMenuItem,
    { open: openEditableMenuItem, close: closeEditableMenuItem },
  ] = useDisclosure(false);

  return showEditableMenuItem ? (
    <EditableItem
      {...props}
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
