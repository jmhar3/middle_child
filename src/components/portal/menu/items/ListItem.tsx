import { ActionIcon, Flex, Group, Popover, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import StyledButton from "../../../StyledButton";
import Badges from "../../../Badges";

import EditIcon from "../../../../icons/EditIcon";
import DeleteIcon from "../../../../icons/DeleteIcon";

import type { MenuItemType } from "../../../../state/types";

interface ListItemProps {
	onDeleteItemClick: () => void;
	onEditItemClick: () => void;
	menuItem: MenuItemType;
}

function ListItem(props: ListItemProps) {
	const { onEditItemClick, onDeleteItemClick, menuItem } = props;

	const [
		confirmDelete,
		{ close: closeConfirmDelete, open: openConfirmDelete },
	] = useDisclosure(false);

	return (
		<Flex p="sm" w="100%" gap="lg">
			<Flex gap="sm" miw="12em">
				<Stack gap={6}>
					<ActionIcon onClick={onEditItemClick} color="darkslategray">
						<EditIcon />
					</ActionIcon>

					<Popover
						width={300}
						trapFocus
						withArrow
						shadow="md"
						position="bottom"
						opened={confirmDelete}
					>
						<Popover.Target>
							<ActionIcon color="darkslategray" onClick={openConfirmDelete}>
								<DeleteIcon />
							</ActionIcon>
						</Popover.Target>

						<Popover.Dropdown>
							<Stack gap="sm">
								<Text>Are you sure you want to delete {menuItem.label}?</Text>

								<Flex gap="sm">
									<StyledButton
										label="Cancel"
										variant="outline"
										onClick={closeConfirmDelete}
									/>

									<StyledButton
										label="Confirm"
										onClick={() => {
											closeConfirmDelete();
											onDeleteItemClick();
										}}
									/>
								</Flex>
							</Stack>
						</Popover.Dropdown>
					</Popover>
				</Stack>

				<Stack gap="0">
					<Text fs="1.4em" fw="600" style={{ textWrap: "nowrap" }}>
						{menuItem.label.toUpperCase()}
					</Text>
					<Text fs="1.4em" fw="600">
						${menuItem.price.toFixed(2)}
					</Text>
				</Stack>
			</Flex>
			<Group w="100%" justify="space-between" align="flex-start" grow>
				{menuItem.modifiers && (
					<Badges label="Modifiers" badges={menuItem.modifiers} />
				)}

				{menuItem.modifierCategories && (
					<Badges
						label="Modifier Categories"
						badges={menuItem.modifierCategories}
					/>
				)}
			</Group>
		</Flex>
	);
}

export default ListItem;
