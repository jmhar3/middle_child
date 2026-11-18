import { v4 as uuid } from "uuid";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

import {
	Flex,
	Text,
	Group,
	Stack,
	Drawer,
	Switch,
	Select,
	Divider,
	TextInput,
	CloseButton,
	MultiSelect,
} from "@mantine/core";

import StyledButton from "../../StyledButton";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { deleteSection, upsertSections } from "../../../state/menu/menuThunks";
import { selectMenu } from "../../../state/menu/menuSlice";

import type { MenuItemType, MenuSection } from "../../../state/types";
import ManageItemsDrawer from "./ManageItemsDrawer";

interface ManageSectionsDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateNew?: (section: MenuSection) => void;
}

function ManageSectionsDrawer(props: ManageSectionsDrawerProps) {
	const { isOpen, onClose, onCreateNew } = props;

	const blankSection: MenuSection = {
		id: uuid(),
		label: "",
		order: 0,
		is_in_stock: true,
		items: [],
	};

	const dispatch = useAppDispatch();
	const sections = useAppSelector(selectMenu);
	const menuItems = sections.flatMap((section) => section.items);

	const [items, setItems] = useState<MenuItemType[] | null>(menuItems);
	const [isUpsertingSection, setIsUpsertingSection] = useState(false);
	const [showSectionInputs, setShowSectionInputs] = useState(!!onCreateNew);
	const [showManageItemsDrawer, setShowManageItemsDrawer] = useState(false);
	const [editedSection, setEditedSection] = useState<MenuSection | null>(
		onCreateNew ? blankSection : null,
	);
	const [selectedSection, setSelectedSection] = useState<MenuSection | null>(
		null,
	);

	if ((menuItems?.length ?? 0) > 0 && !items) setItems(menuItems);

	const onCloseDrawer = () => {
		setSelectedSection(null);
		setSelectedSection(null);
		setShowSectionInputs(false);
		onClose();
	};

	const onSelectSection = (itemId: string | null) => {
		const item = sections.find(({ id }) => id === itemId);
		setSelectedSection(item || null);
	};

	const onEditItem = () => {
		setShowSectionInputs(true);
		setEditedSection(selectedSection ? selectedSection : blankSection);
	};

	const onAddNewSection = () => {
		setSelectedSection(null);
		setEditedSection(blankSection);
		setShowSectionInputs(true);
	};

	const toggleStock = (isInStock: boolean) => {
		if (editedSection)
			setEditedSection({
				...editedSection,
				is_in_stock: isInStock,
			});
	};

	const onSelectItems = (itemIds: string[]) => {
		const selectedItems = items?.filter(({ id }) =>
			itemIds.some((itemId) => itemId === id),
		);
		if (editedSection)
			setEditedSection({
				...editedSection,
				items: selectedItems || [],
			});
	};

	const onCreateNewItem = (item: MenuItemType) => {
		setItems(items ? [...items, item] : [item]);
		if (editedSection)
			setEditedSection({
				...editedSection,
				items: editedSection.items ? [...editedSection.items, item] : [item],
			});
	};

	const onDeleteSection = () => {
		setIsUpsertingSection(true);
		if (selectedSection) {
			dispatch(deleteSection(selectedSection.id))
				.then((data) => {
					if (data.payload) {
						notifications.show({
							withCloseButton: false,
							message: "Options successfully updated",
							position: "bottom-right",
							color: "green",
						});
					}
				})
				.catch((error) =>
					notifications.show({
						message: error,
						withCloseButton: false,
						position: "bottom-right",
						color: "red",
					}),
				);
		}
		setIsUpsertingSection(false);
	};

	const upsert = (section: Partial<MenuSection>) => {
		dispatch(upsertSections([section]))
			.then((data) => {
				if (data.payload) {
					const payload = data.payload as MenuSection[];
					if (onCreateNew) {
						onCloseDrawer();
						onCreateNew(payload[0]);
					}
					notifications.show({
						withCloseButton: false,
						message: "Sections successfully updated",
						position: "bottom-right",
						color: "green",
					});
				}
			})
			.catch((error) =>
				notifications.show({
					message: error,
					withCloseButton: false,
					position: "bottom-right",
					color: "red",
				}),
			);
	};

	const onSave = () => {
		setIsUpsertingSection(true);
		if (editedSection) {
			if (selectedSection) {
				upsert(editedSection);
			} else {
				const section: Partial<MenuSection> = { ...editedSection };
				delete section.id;
				upsert(section);
			}
		}
		setIsUpsertingSection(false);
	};

	return (
		<>
			{showManageItemsDrawer && (
				<ManageItemsDrawer
					isOpen={showManageItemsDrawer}
					onClose={() => setShowManageItemsDrawer(false)}
					onCreateNew={onCreateNewItem}
				/>
			)}

			<Drawer
				size="100%"
				offset={12}
				radius="sm"
				position="right"
				opened={isOpen}
				onClose={onCloseDrawer}
				withCloseButton={false}
				trapFocus={false}
			>
				<Stack align="flex-end">
					<Flex w="100%" justify="space-between" align="center">
						<Text size="1.4em" fw="600" ta="left" w="100%">
							{onCreateNew ? "CREATE SECTION" : "MANAGE SECTIONS"}
						</Text>

						<CloseButton onClick={onCloseDrawer} />
					</Flex>

					{!onCreateNew && (
						<>
							<Divider w="100%" />

							<Stack
								w="100%"
								gap="xs"
								bd="solid 1px lightgray"
								bdrs="sm"
								p="sm"
							>
								<Select
									w="100%"
									size="md"
									searchable
									disabled={showSectionInputs}
									label="Select Section to Edit"
									nothingFoundMessage="No sections found matching your search"
									value={selectedSection?.id}
									onChange={onSelectSection}
									data={sections?.map((item) => ({
										value: item.id,
										label: item.label,
									}))}
								/>

								<Group gap="sm" grow>
									<StyledButton
										label="Delete"
										onClick={onDeleteSection}
										isDisabled={!selectedSection || showSectionInputs}
										isLoading={isUpsertingSection}
									/>

									<StyledButton
										label="Edit"
										onClick={onEditItem}
										isDisabled={!selectedSection || showSectionInputs}
										isLoading={isUpsertingSection}
									/>
								</Group>

								<Text ta="center">OR</Text>

								<Group gap="sm" grow>
									<StyledButton
										variant="outline"
										label="Create New Section"
										onClick={onAddNewSection}
										isDisabled={showSectionInputs}
										isLoading={isUpsertingSection}
									/>
								</Group>
							</Stack>
						</>
					)}

					{showSectionInputs && editedSection && (
						<Stack w="100%" gap="sm">
							<TextInput
								w="100%"
								size="md"
								label="Label"
								value={editedSection.label}
								onChange={(event) =>
									editedSection &&
									setEditedSection({
										...editedSection,
										label: event.target.value,
									})
								}
							/>

							<Switch
								size="md"
								checked={editedSection.is_in_stock}
								onChange={(event) => toggleStock(event.currentTarget.checked)}
								label="Is In Stock"
							/>

							<Divider />

							<Stack p="md" w="100%" gap="sm" bdrs="sm" bg="whitesmoke">
								<MultiSelect
									w="100%"
									size="md"
									label="Items"
									placeholder="Select items"
									nothingFoundMessage="No items found matching your search"
									value={editedSection.items?.map(({ id }) => id)}
									onChange={onSelectItems}
									data={items?.map((item) => ({
										value: item.id,
										label: item.label,
									}))}
									hidePickedOptions
									searchable
								/>

								<Group grow gap="sm">
									<StyledButton
										label="Add New Item"
										onClick={() => setShowManageItemsDrawer(true)}
									/>
								</Group>
							</Stack>

							<Group grow gap="sm">
								<StyledButton
									label="Cancel"
									variant="outline"
									onClick={() => {
										setShowSectionInputs(false);
										if (onCreateNew) onCloseDrawer();
									}}
									isLoading={isUpsertingSection}
								/>

								<StyledButton
									label="Confirm"
									onClick={onSave}
									isLoading={isUpsertingSection}
								/>
							</Group>
						</Stack>
					)}
				</Stack>
			</Drawer>
		</>
	);
}

export default ManageSectionsDrawer;
