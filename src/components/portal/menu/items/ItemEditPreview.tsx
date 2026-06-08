import { useDisclosure } from "@mantine/hooks";

import ListItem from "./ListItem";
import EditableItem from "./EditableItem";

import type { MenuItemType } from "../../../../state/types";

interface EditItemPreviewProps {
	menuItem: MenuItemType;
	onDeleteItem: (id: string) => void;
}

function EditItemPreview(props: EditItemPreviewProps) {
	const { menuItem, onDeleteItem } = props;

	const [
		showEditableMenuItem,
		{ open: openEditableMenuItem, close: closeEditableMenuItem },
	] = useDisclosure(false);

	return showEditableMenuItem ? (
		<EditableItem
			menuItem={menuItem}
			onCloseEditableItem={closeEditableMenuItem}
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
