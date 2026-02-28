import { useDisclosure } from "@mantine/hooks";

import MenuItem from "./MenuItem";
import MenuItemEdit from "./EditableItem";

import type { MenuItemType } from "../../../helpers/menu";

function EditItemPreview({ menuItem }: { menuItem: MenuItemType }) {
  const [
    showEditableMenuItem,
    { open: openEditableMenuItem, close: closeEditableMenuItem },
  ] = useDisclosure(false);

  const onSaveMenuItem = () => {
    closeEditableMenuItem();
  };

  return showEditableMenuItem ? (
    <MenuItemEdit menuItem={menuItem} onSaveMenuItem={onSaveMenuItem} />
  ) : (
    <MenuItem onEditItemClick={openEditableMenuItem} menuItem={menuItem} />
  );
}

export default EditItemPreview;
