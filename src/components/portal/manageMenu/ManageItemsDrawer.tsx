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
	Textarea,
	TextInput,
	NumberInput,
	CloseButton,
	MultiSelect,
} from "@mantine/core";

import StyledButton from "../../StyledButton";
import MenuItemModal from "../../MenuItemModal";
import ManageOptionsDrawer from "./ManageOptionsDrawer";
import ManageModifiersDrawer from "./ManageModifiersDrawer";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { selectMenu } from "../../../state/menu/menuSlice";
import { selectAllModifiers } from "../../../state/modifiers/modifiersSlice";
import { selectAllItemOptions } from "../../../state/itemOptions/itemOptionsSlice";

import {
	deleteMenuItem,
	upsertMenuItems,
} from "../../../state/menuItems/menuItemsThunks";

import type {
	ItemOptions,
	MenuItemType,
	MenuSection,
	Modifier,
} from "../../../state/types";

interface ManageItemsDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

function ManageItemsDrawer(props: ManageItemsDrawerProps) {
	const { isOpen, onClose } = props;

	const dispatch = useAppDispatch();
	const menu: MenuSection[] = useAppSelector(selectMenu);
	const allModifiers = useAppSelector(selectAllModifiers);
	const allOptions = useAppSelector(selectAllItemOptions);
	const menuItems = menu.flatMap((menuSection) => menuSection.items);

	const [showManageModifiersDrawer, setShowManageModifiersDrawer] =
		useState(false);
	const [showManageOptionsDrawer, setShowManageOptionsDrawer] = useState(false);
	const [showMenuItemModal, setShowMenuItemModal] = useState(false);
	const [isUpsertingItem, setIsUpsertingItem] = useState(false);
	const [showItemInputs, setShowItemInputs] = useState(false);
	const [showCodeInput, setShowCodeInput] = useState(false);
	const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
	const [editedItem, setEditedItem] = useState<MenuItemType | null>(null);
	const [modifiers, setModifiers] = useState(allModifiers);
	const [options, setOptions] = useState(allOptions);

	if (allModifiers?.length && allModifiers?.length > 0 && !modifiers)
		setModifiers(allModifiers);
	if (allOptions?.length && allOptions?.length > 0 && !options)
		setOptions(allOptions);

	const blankItem: MenuItemType = {
		id: uuid(),
		label: "",
		price: 0,
		has_large: false,
		has_long_prep_time: false,
		is_applicable_loyalty_item: false,
		is_in_stock: true,
		order: 0,
	};

	const onCloseDrawer = () => {
		setSelectedItem(null);
		setShowCodeInput(false);
		setSelectedItem(null);
		setShowItemInputs(false);
		onClose();
	};

	const onSelectItem = (itemId: string | null) => {
		const item = menuItems.find(({ id }) => id === itemId);
		setSelectedItem(item || null);
	};

	const onEditItem = () => {
		setShowItemInputs(true);
		if (selectedItem?.reference_code) setShowCodeInput(true);
		setEditedItem(selectedItem ? selectedItem : blankItem);
	};

	const onAddNewItem = () => {
		setSelectedItem(null);
		setShowCodeInput(false);
		setEditedItem(blankItem);
		setShowItemInputs(true);
	};

	const setSection = (sectionId: string | null) => {
		const section = menu.find(({ id }) => id === sectionId);
		if (section && editedItem)
			setEditedItem({
				...editedItem,
				section: section,
			});
	};

	const onSelectModifiers = (modifierIds: string[]) => {
		const selectedModifiers = modifiers.filter(({ id }) =>
			modifierIds.some((modifierId) => modifierId === id),
		);
		if (editedItem)
			setEditedItem({
				...editedItem,
				modifiers: selectedModifiers,
			});
	};

	const onSelectOptions = (optionIds: string[]) => {
		const selectedOptions = options.filter(({ id }) =>
			optionIds.some((optionId) => optionId === id),
		);
		if (editedItem)
			setEditedItem({
				...editedItem,
				modifiers: selectedOptions,
			});
	};

	const toggleReferenceCode = (hasReferenceCode: boolean) => {
		setShowCodeInput(hasReferenceCode);
	};

	const toggleLarge = (hasLarge: boolean) => {
		if (editedItem)
			setEditedItem({
				...editedItem,
				has_large: hasLarge,
			});
	};

	const toggleLoyaltyPointItem = (isLoyaltyPointItem: boolean) => {
		if (editedItem)
			setEditedItem({
				...editedItem,
				is_applicable_loyalty_item: isLoyaltyPointItem,
			});
	};

	const toggleLongPrepTime = (hasLongPrepTime: boolean) => {
		if (editedItem)
			setEditedItem({
				...editedItem,
				has_long_prep_time: hasLongPrepTime,
			});
	};

	const onCreateNewModifier = (modifier: Modifier) => {
		setModifiers([...modifiers, modifier]);
		if (editedItem)
			setEditedItem({
				...editedItem,
				modifiers: editedItem.modifiers
					? [...editedItem.modifiers, modifier]
					: [modifier],
			});
	};

	const onCreateNewOption = (option: ItemOptions) => {
		setOptions([...options, option]);
		if (editedItem)
			setEditedItem({
				...editedItem,
				modifierCategories: editedItem.modifierCategories
					? [...editedItem.modifierCategories, option]
					: [option],
			});
	};

	const onDeleteItem = () => {
		setIsUpsertingItem(true);
		if (selectedItem) {
			dispatch(deleteMenuItem(selectedItem.id))
				.then((data) => {
					if (data.payload) {
						notifications.show({
							withCloseButton: false,
							message: "Options successfully updated",
							position: "bottom-right",
							color: "green",
						});
						onClose();
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
		setIsUpsertingItem(false);
	};

	const onSave = () => {
		setIsUpsertingItem(true);
		if (selectedItem && editedItem) {
			dispatch(upsertMenuItems([editedItem]));
		} else if (editedItem) {
			dispatch(upsertMenuItems([editedItem]));
		}
		setIsUpsertingItem(false);
	};

	return (
		<>
			{showManageModifiersDrawer && (
				<ManageModifiersDrawer
					isOpen={showManageModifiersDrawer}
					onClose={() => setShowManageModifiersDrawer(false)}
					onCreateNew={onCreateNewModifier}
				/>
			)}

			{showManageOptionsDrawer && (
				<ManageOptionsDrawer
					isOpen={showManageOptionsDrawer}
					onClose={() => setShowManageOptionsDrawer(false)}
					onCreateNew={onCreateNewOption}
				/>
			)}

			{editedItem && showMenuItemModal && (
				<MenuItemModal
					menuItem={editedItem}
					onAddToOrder={() => {}}
					isOpen={showMenuItemModal}
					onClose={() => setShowMenuItemModal(false)}
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
							MANAGE ITEMS
						</Text>

						<CloseButton onClick={onCloseDrawer} />
					</Flex>

					<Divider w="100%" />

					<Stack w="100%" gap="xs" bd="solid 1px lightgray" bdrs="sm" p="sm">
						<Select
							w="100%"
							size="md"
							searchable
							disabled={showItemInputs}
							label="Select Item to Edit"
							nothingFoundMessage="No sections found matching your search"
							value={selectedItem?.id}
							onChange={onSelectItem}
							data={menuItems?.map((item) => ({
								value: item.id,
								label: item.label,
							}))}
						/>

						<Group gap="sm" grow>
							<StyledButton
								label="Delete"
								onClick={onDeleteItem}
								isDisabled={!selectedItem || showItemInputs}
								isLoading={isUpsertingItem}
							/>

							<StyledButton
								label="Edit"
								onClick={onEditItem}
								isDisabled={!selectedItem || showItemInputs}
								isLoading={isUpsertingItem}
							/>
						</Group>

						<Text ta="center">OR</Text>

						<Group gap="sm" grow>
							<StyledButton
								variant="outline"
								label="Create New Item"
								onClick={onAddNewItem}
								isDisabled={showItemInputs}
								isLoading={isUpsertingItem}
							/>
						</Group>
					</Stack>

					{showItemInputs && editedItem && (
						<Stack w="100%">
							<Flex p="md" w="100%" bdrs="sm" bg="whitesmoke">
								<Select
									w="100%"
									size="md"
									searchable
									label="Menu Section"
									nothingFoundMessage="No sections found matching your search"
									value={editedItem.section?.id}
									data={menu?.map((section) => ({
										value: section.id,
										label: section.label,
									}))}
									onChange={setSection}
								/>
							</Flex>

							<Stack gap="xs">
								<Flex gap="xs">
									{showCodeInput && (
										<TextInput
											w="90px"
											size="md"
											label="Code"
											value={editedItem.reference_code}
											onChange={(event) =>
												setEditedItem((prevItem) =>
													prevItem
														? {
																...prevItem,
																reference_code: event.target.value,
															}
														: {
																...blankItem,
																reference_code: event.target.value,
															},
												)
											}
										/>
									)}

									<TextInput
										w="100%"
										size="md"
										label="Label"
										value={editedItem.label}
										onChange={(event) =>
											setEditedItem((prevItem) =>
												prevItem
													? {
															...prevItem,
															label: event.target.value,
														}
													: { ...blankItem, label: event.target.value },
											)
										}
									/>
								</Flex>

								<Switch
									size="md"
									checked={showCodeInput}
									onChange={(event) =>
										toggleReferenceCode(event.currentTarget.checked)
									}
									label="Has Reference Code"
									description="Orders show code by default"
								/>
							</Stack>

							<Divider />

							<Textarea
								w="100%"
								size="md"
								label="Description"
								value={editedItem.description}
								onChange={(event) =>
									setEditedItem((prevItem) =>
										prevItem
											? {
													...prevItem,
													description: event.target.value,
												}
											: { ...blankItem, description: event.target.value },
									)
								}
							/>

							<Divider />

							<Stack gap="xs">
								<Group grow gap="xs">
									<NumberInput
										w="90px"
										size="md"
										label={editedItem.has_large ? "Small" : "Price"}
										value={editedItem.price}
										onChange={(price) =>
											setEditedItem((prevItem) =>
												prevItem
													? {
															...prevItem,
															price:
																typeof price === "string"
																	? Number(price)
																	: price,
														}
													: {
															...blankItem,
															price:
																typeof price === "string"
																	? Number(price)
																	: price,
														},
											)
										}
									/>

									{editedItem.has_large && (
										<NumberInput
											w="90px"
											size="md"
											label="Large"
											value={editedItem.large_price}
											onChange={(price) =>
												setEditedItem((prevItem) =>
													prevItem
														? {
																...prevItem,
																large_price:
																	typeof price === "string"
																		? Number(price)
																		: price,
															}
														: {
																...blankItem,
																large_price:
																	typeof price === "string"
																		? Number(price)
																		: price,
															},
												)
											}
										/>
									)}
								</Group>

								<Switch
									size="md"
									checked={editedItem.has_large}
									onChange={(event) => toggleLarge(event.currentTarget.checked)}
									label="Has Large"
								/>
							</Stack>

							<Flex p="md" w="100%" gap="sm" bdrs="sm" bg="whitesmoke">
								<Stack w="100%" gap="sm">
									<MultiSelect
										w="100%"
										size="md"
										label="Modifiers"
										placeholder="Select item modifiers"
										nothingFoundMessage="No modifiers found matching your search"
										value={editedItem.modifiers?.map(({ id }) => id)}
										onChange={onSelectModifiers}
										data={modifiers?.map((modifier) => ({
											value: modifier.id,
											label: modifier.label,
										}))}
										hidePickedOptions
										searchable
									/>

									<Group grow>
										<StyledButton
											label="Add New Modifier"
											onClick={() => setShowManageModifiersDrawer(true)}
										/>
									</Group>
								</Stack>

								<Divider orientation="vertical" />

								<Stack w="100%" gap="sm">
									<MultiSelect
										w="100%"
										size="md"
										label="Options"
										placeholder="Select item options"
										nothingFoundMessage="No options found matching your search"
										value={editedItem.modifierCategories?.map(({ id }) => id)}
										onChange={onSelectOptions}
										data={options?.map((option) => ({
											value: option.id,
											label: option.label,
										}))}
										hidePickedOptions
										searchable
									/>

									<Group grow>
										<StyledButton
											label="Add New Option"
											onClick={() => setShowManageOptionsDrawer(true)}
										/>
									</Group>
								</Stack>
							</Flex>

							<Group grow gap="sm">
								<Switch
									size="md"
									checked={editedItem.is_applicable_loyalty_item}
									onChange={(event) =>
										toggleLoyaltyPointItem(event.currentTarget.checked)
									}
									description="Applicable to earn loyalty points & to claim free item"
									label="Is Loyalty Point Item"
								/>

								<Switch
									size="md"
									checked={editedItem.has_long_prep_time}
									onChange={(event) =>
										toggleLongPrepTime(event.currentTarget.checked)
									}
									description="Orders with this item will have a longer minimum order time"
									label="Has Long Prep Time"
								/>
							</Group>

							<Group grow gap="sm">
								<StyledButton
									label="Cancel"
									variant="outline"
									onClick={() => setShowItemInputs(false)}
									isLoading={isUpsertingItem}
								/>
								<StyledButton
									label="Preview"
									onClick={() => setShowMenuItemModal(true)}
								/>
								<StyledButton
									label="Confirm"
									onClick={onSave}
									isLoading={isUpsertingItem}
								/>
							</Group>
						</Stack>
					)}
				</Stack>
			</Drawer>
		</>
	);
}

export default ManageItemsDrawer;
