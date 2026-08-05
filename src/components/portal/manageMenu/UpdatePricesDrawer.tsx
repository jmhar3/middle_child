import { useState } from "react";
import { notifications } from "@mantine/notifications";

import {
	Text,
	Flex,
	Group,
	Stack,
	Drawer,
	Switch,
	Button,
	Divider,
	Checkbox,
	Accordion,
	NumberInput,
	SegmentedControl,
	CloseButton,
} from "@mantine/core";

import StyledButton from "../../StyledButton";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { upsertMenuItems } from "../../../state/menuItems/menuItemsThunks";
import { fetchMenu } from "../../../state/menu/menuThunks";
import { selectMenu } from "../../../state/menu/menuSlice";

import type {
	MenuItemType,
	MenuSection,
	UpsertMenuItem,
} from "../../../state/types";

interface UpdatePricesDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

function UpdatePricesDrawer(props: UpdatePricesDrawerProps) {
	const dispatch = useAppDispatch();
	const menu: MenuSection[] = useAppSelector(selectMenu);
	const menuItems = menu.flatMap((menuSection) => menuSection.items);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasLarge, setHasLarge] = useState(false);
	const [menuView, setMenuView] = useState<"Edit Selection" | "Edit All">(
		"Edit All",
	);
	const [itemsToEdit, setItemsToEdit] = useState<MenuItemType[]>([]);
	const [showPriceEdit, setShowPriceEdit] = useState(false);
	const [editedMenu, setEditedMenu] = useState(menu);

	const [newPrices, setNewPrices] = useState<{
		base: number;
		large?: number;
	}>({ base: 0 });

	const firstItem = itemsToEdit[0];

	if (menu.length > 0 && editedMenu.length === 0) setEditedMenu(menu);

	const onClearSelection = () => {
		setShowPriceEdit(false);
		setNewPrices({ base: 0 });
	};

	const onClearDrawer = () => {
		onClearSelection();
		setHasLarge(false);
		setMenuView("Edit All");
		setItemsToEdit([]);
		setEditedMenu(menu);
	};

	const onCloseDrawer = () => {
		props.onClose();
		onClearDrawer();
	};

	const onSelectItemToEdit = (itemIds: string[]) =>
		setItemsToEdit(
			menuItems.filter((item) => itemIds.some((id) => item.id === id)),
		);

	const onEditSelection = () => {
		if (itemsToEdit.length > 0) {
			setShowPriceEdit(true);
			if (firstItem.has_large) setHasLarge(true);
			setNewPrices({ base: firstItem.price, large: firstItem.large_price });
		}
	};

	const onEditBasePrice = (params: {
		sectionId: string;
		itemId: string;
		price: number;
	}) => {
		const { sectionId, itemId, price } = params;

		setEditedMenu((prevMenu) =>
			prevMenu.map((section) => {
				if (section.id === sectionId) {
					const items = section.items.map((item) =>
						item.id === itemId ? { ...item, price: price } : item,
					);
					return { ...section, items: items };
				}
				return section;
			}),
		);
	};

	const onEditLargePrice = (params: {
		sectionId: string;
		itemId: string;
		price: number;
	}) => {
		const { sectionId, itemId, price } = params;

		setEditedMenu((prevMenu) =>
			prevMenu.map((section) => {
				if (section.id === sectionId) {
					const items = section.items.map((item) =>
						item.id === itemId
							? { ...item, large_price: price === 0 ? undefined : price }
							: item,
					);
					return { ...section, items: items };
				}
				return section;
			}),
		);
	};

	const onToggleLarge = (params: {
		sectionId: string;
		itemId: string;
		hasLarge: boolean;
	}) => {
		const { sectionId, itemId, hasLarge } = params;

		setEditedMenu((prevMenu) =>
			prevMenu.map((section) => {
				if (section.id === sectionId) {
					const items = section.items.map((item) =>
						item.id === itemId ? { ...item, has_large: hasLarge } : item,
					);
					return { ...section, items: items };
				}
				return section;
			}),
		);
	};

	const handleUpdate = (items: UpsertMenuItem[]) => {
		dispatch(upsertMenuItems(items))
			.then((data) => {
				if (data.payload) {
					notifications.show({
						message: "Prices updated successfully",
						withCloseButton: false,
						position: "bottom-right",
						color: "green",
					});
					dispatch(fetchMenu());
					onClearDrawer();
				}
			})
			.catch((error) =>
				notifications.show({
					message: error,
					withCloseButton: false,
					position: "bottom-right",
					color: "red",
				}),
			)
			.finally(() => setIsSubmitting(false));
	};

	const onSaveChanges = () => {
		setIsSubmitting(true);

		if (menuView === "Edit All") {
			const allItems = menu.flatMap(({ items }) => items);
			const allEditableItems = editedMenu.flatMap(({ items }) => items);

			const filterEditedItems = allEditableItems.filter((item) => {
				const findItem = allItems.find((item2) => item.id === item2.id);

				if (findItem) {
					return (
						findItem.price !== item.price ||
						findItem.large_price !== item.large_price ||
						findItem.has_large !== item.has_large
					);
				}

				return false;
			});

			const itemsWithNewPrices = filterEditedItems.map((item) => ({
				...item,
				section: item.section?.id,
				large_price: item.has_large ? item.large_price : undefined,
			}));

			handleUpdate(itemsWithNewPrices);
		} else {
			const itemsWithNewPrices = itemsToEdit.map((item) => ({
				...item,
				price: newPrices.base,
				large_price: hasLarge ? newPrices.large : undefined,
				has_large: hasLarge,
				section: item.section?.id,
			}));

			handleUpdate(itemsWithNewPrices);
		}
	};

	return (
		<Drawer
			size="100%"
			offset={12}
			radius="sm"
			position="right"
			opened={props.isOpen}
			onClose={onCloseDrawer}
			withCloseButton={false}
			trapFocus={false}
		>
			<Stack align="flex-end">
				<Flex w="100%" justify="space-between" align="center">
					<Text size="1.4em" fw="600" ta="left" w="100%">
						UPDATE PRICES
					</Text>

					<CloseButton onClick={onCloseDrawer} />
				</Flex>

				{showPriceEdit ? (
					<Stack w="100%">
						<Stack align="flex-end">
							<Flex gap="xs" align="flex-end" w="100%">
								<NumberInput
									w="100%"
									label="Base Price"
									value={newPrices?.base}
									onChange={(price) =>
										setNewPrices({
											...newPrices,
											base: typeof price === "string" ? Number(price) : price,
										})
									}
								/>

								{hasLarge && (
									<NumberInput
										w="100%"
										label="Large"
										value={newPrices?.large}
										onChange={(price) =>
											setNewPrices({
												...newPrices,
												large:
													typeof price === "string" ? Number(price) : price,
											})
										}
									/>
								)}
							</Flex>

							<Switch
								checked={hasLarge}
								onChange={(event) => setHasLarge(event.currentTarget.checked)}
								label="Enable Large"
							/>
						</Stack>

						<Divider />

						<Stack w="100%" gap="xs">
							<Flex justify="space-between">
								<Text>Items to Edit</Text>

								<Button
									size="sm"
									variant="outline"
									color="darkslategray"
									onClick={() => setShowPriceEdit(false)}
								>
									Edit Selection
								</Button>
							</Flex>

							<Stack w="100%" gap="0" bdrs="sm" bd="solid 1px darkslategray">
								{itemsToEdit.map((item, index) => (
									<>
										{index !== 0 && <Divider my="0" />}
										<Flex
											w="100%"
											pr="sm"
											align="center"
											justify="space-between"
										>
											<Stack key={item.id} gap="0" p="sm">
												<Text fw="bold">{item.label}</Text>
												<Text>{item.description}</Text>
											</Stack>

											<Stack gap="0" py="xs">
												<Text>
													{hasLarge &&
														(item.large_price || newPrices.large) &&
														"S: "}
													${item.price.toFixed(2)}
													{" -> "}${newPrices.base.toFixed(2)}
												</Text>

												{!hasLarge && item.large_price && (
													<Text size="sm">Large option removed</Text>
												)}

												{hasLarge && (
													<>
														{item.large_price && !newPrices.large && (
															<Text>L: ${item.large_price.toFixed(2)}</Text>
														)}
														{newPrices.large && (
															<Text>
																L: ${(item.large_price || 0).toFixed(2)}
																{" -> "}${newPrices.large.toFixed(2)}
															</Text>
														)}
													</>
												)}
											</Stack>
										</Flex>
									</>
								))}
							</Stack>
						</Stack>

						<Group grow>
							<StyledButton
								label="Cancel"
								variant="outline"
								isLoading={isSubmitting}
								onClick={onClearSelection}
							/>

							<StyledButton
								label="Save Changes"
								onClick={onSaveChanges}
								isLoading={isSubmitting}
							/>
						</Group>
					</Stack>
				) : (
					<Stack w="100%">
						<Stack gap="3px">
							<Text>Select Update Method</Text>

							<SegmentedControl
								w="100%"
								value={menuView}
								onChange={(value) =>
									setMenuView(value as "Edit Selection" | "Edit All")
								}
								data={["Edit All", "Edit Selection"]}
							/>
						</Stack>

						<Stack w="100%" gap="xs" bd="solid 1px lightgray" bdrs="sm" p="sm">
							{menuView === "Edit Selection" && (
								<Accordion defaultValue={menu[0].id}>
									{menu.map((section) => (
										<Accordion.Item key={section.id} value={section.id}>
											<Accordion.Control>{section.label}</Accordion.Control>

											<Accordion.Panel>
												<Checkbox.Group
													value={itemsToEdit.map(({ id }) => id)}
													onChange={onSelectItemToEdit}
												>
													<Stack mt="xs">
														{section.items.map((item) => (
															<Flex
																key={item.id}
																align="center"
																justify="space-between"
															>
																<Checkbox
																	key={item.id}
																	value={item.id}
																	label={item.label}
																/>
																<Text>
																	{item.price}
																	{item.has_large && ` / ${item.large_price}`}
																</Text>
															</Flex>
														))}
													</Stack>
												</Checkbox.Group>
											</Accordion.Panel>
										</Accordion.Item>
									))}
								</Accordion>
							)}

							{menuView === "Edit All" && editedMenu.length > 0 && (
								<Accordion defaultValue={editedMenu[0].id}>
									{editedMenu.map((section) => (
										<Accordion.Item key={section.id} value={section.id}>
											<Accordion.Control>{section.label}</Accordion.Control>

											<Accordion.Panel>
												<Stack gap="sm">
													{section.items.map((item, index) => (
														<>
															{index !== 0 && <Divider />}

															<Flex
																key={item.id}
																w="100%"
																gap="sm"
																align="center"
																justify="space-between"
															>
																<Stack gap="3px">
																	<Text>{item.label}</Text>

																	<Switch
																		size="xs"
																		checked={item.has_large}
																		onChange={(event) =>
																			onToggleLarge({
																				itemId: item.id,
																				sectionId: section.id,
																				hasLarge: event.currentTarget.checked,
																			})
																		}
																		label="Has Large"
																	/>
																</Stack>

																<Flex gap="3px">
																	<NumberInput
																		w="90px"
																		label={item.has_large ? "Small" : "Price"}
																		value={item.price}
																		onChange={(price) =>
																			onEditBasePrice({
																				sectionId: section.id,
																				itemId: item.id,
																				price: Number(price),
																			})
																		}
																	/>

																	{item.has_large && (
																		<NumberInput
																			w="90px"
																			label="Large"
																			value={item.large_price}
																			onChange={(price) =>
																				onEditLargePrice({
																					sectionId: section.id,
																					itemId: item.id,
																					price: Number(price),
																				})
																			}
																		/>
																	)}
																</Flex>
															</Flex>
														</>
													))}
												</Stack>
											</Accordion.Panel>
										</Accordion.Item>
									))}
								</Accordion>
							)}
						</Stack>

						<Group grow>
							<StyledButton
								label="Cancel"
								variant="outline"
								isLoading={isSubmitting}
								onClick={showPriceEdit ? onClearDrawer : onCloseDrawer}
							/>
							{menuView === "Edit All" ? (
								<StyledButton
									label="Save Changes"
									isLoading={isSubmitting}
									onClick={onSaveChanges}
								/>
							) : (
								<StyledButton
									label="Edit Selection"
									isLoading={isSubmitting}
									onClick={onEditSelection}
								/>
							)}
						</Group>
					</Stack>
				)}
			</Stack>
		</Drawer>
	);
}

export default UpdatePricesDrawer;
