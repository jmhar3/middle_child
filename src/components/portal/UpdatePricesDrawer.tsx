import { useState } from "react";

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
} from "@mantine/core";

import StyledButton from "../StyledButton";

import { useAppSelector } from "../../state/hooks";
import { selectMenu } from "../../state/menu/menuSlice";

import type { MenuItemType, MenuSection } from "../../state/types";

interface UpdatePricesDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

function UpdatePricesDrawer(props: UpdatePricesDrawerProps) {
	const menu: MenuSection[] = useAppSelector(selectMenu);
	const menuItems = menu.flatMap((menuSection) => menuSection.items);

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

	const onCloseDrawer = () => {
		props.onClose();
		setHasLarge(false);
		setMenuView("Edit Selection");
		setItemsToEdit([]);
		setShowPriceEdit(false);
		setNewPrices({ base: 0 });
		setEditedMenu(menu);
	};

	const onSelectItemToEdit = (itemIds: string[]) =>
		setItemsToEdit(
			menuItems.filter((item) => itemIds.some((id) => item.id === id)),
		);

	const onEditSelection = () => {
		setShowPriceEdit(true);
		if (firstItem.large_price) setHasLarge(true);
		setNewPrices({ base: firstItem.price, large: firstItem.large_price });
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
						item.id === itemId ? { ...item, large_price: price } : item,
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
						item.id === itemId
							? { ...item, large_price: hasLarge ? 0 : undefined }
							: item,
					);
					return { ...section, items: items };
				}
				return section;
			}),
		);
	};

	const onSaveChanges = () => {
		if (menuView === "Edit All") {
			const allItems = menu.flatMap(({ items }) => items);
			const allEditableItems = editedMenu.flatMap(({ items }) => items);
			allEditableItems.forEach((item) => {
				const findItem = allItems.find((item2) => item.id === item2.id);
				if (findItem) {
					if (
						findItem.price !== item.price ||
						findItem.large_price !== item.large_price
					) {
						// update item with new prices
						console.log(item);
						console.log(newPrices);
					}
				}
			});
		}
		itemsToEdit.forEach((item) => {
			// update item with new prices
			console.log(item);
			console.log(newPrices);
		});
	};

	return (
		<Drawer
			offset={12}
			radius="sm"
			position="right"
			opened={props.isOpen}
			onClose={onCloseDrawer}
			withCloseButton={false}
			trapFocus={false}
		>
			<Stack align="flex-end">
				<Text size="1.4em" fw="600" ta="left" w="100%">
					UPDATE PRICES
				</Text>

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
									color="darkslategray"
									variant="outline"
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
								onClick={onCloseDrawer}
							/>
							<StyledButton label="Save Changes" onClick={onSaveChanges} />
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
													<Group mt="xs">
														{section.items.map((item) => (
															<Checkbox
																key={item.id}
																value={item.id}
																label={item.label}
															/>
														))}
													</Group>
												</Checkbox.Group>
											</Accordion.Panel>
										</Accordion.Item>
									))}
								</Accordion>
							)}

							{menuView === "Edit All" && (
								<Accordion defaultValue={menu[0].id}>
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
																		checked={!!item.large_price}
																		onChange={(event) =>
																			onToggleLarge({
																				sectionId: section.id,
																				itemId: item.id,
																				hasLarge: event.currentTarget.checked,
																			})
																		}
																		label="Has Large"
																	/>
																</Stack>

																<Flex gap="3px">
																	<NumberInput
																		w="90px"
																		label={item.large_price ? "Small" : "Price"}
																		value={item.price}
																		onChange={(price) =>
																			onEditBasePrice({
																				sectionId: section.id,
																				itemId: item.id,
																				price: Number(price),
																			})
																		}
																	/>

																	{!!item.large_price && (
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
								onClick={onCloseDrawer}
							/>
							{menuView === "Edit All" ? (
								<StyledButton label="Save Changes" onClick={onSaveChanges} />
							) : (
								<StyledButton
									label="Edit Selection"
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
