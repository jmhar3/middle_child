import { v4 as uuid } from "uuid";
import { useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";

import {
	Divider,
	Drawer,
	Text,
	Flex,
	Group,
	Stack,
	Select,
	TextInput,
} from "@mantine/core";

import StyledButton from "../../StyledButton";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { fetchItemOptions } from "../../../state/itemOptions/itemOptionThunks";

import {
	selectItemOptionById,
	selectItemOptionsStatus,
} from "../../../state/itemOptions/itemOptionsSlice";

import {
	deleteModifier,
	insertModifier,
	updateModifier,
} from "../../../state/modifiers/modifierThunks";

import type { Modifier } from "../../../state/types";

interface UpdateBeansDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

function UpdateBeansDrawer(props: UpdateBeansDrawerProps) {
	const beansOptionsId = "65a5b843-8815-4c9d-b2d0-5e510f48d4fa";
	const dispatch = useAppDispatch();
	const itemOptionsStatus = useAppSelector(selectItemOptionsStatus);
	const beans = useAppSelector((state) =>
		selectItemOptionById(state, beansOptionsId),
	);

	const isLoading = itemOptionsStatus === "pending";

	useEffect(() => {
		if (itemOptionsStatus === "idle") {
			dispatch(fetchItemOptions());
		}
	}, [dispatch, itemOptionsStatus]);

	const [beanToEdit, setBeanToEdit] = useState<string | null>("");
	const [editedBean, setEditedBean] = useState<Modifier | null>();
	const [newBean, setNewBean] = useState<Modifier | null>();
	const [beansToDelete, setBeansToDelete] = useState<Modifier[]>([]);
	const [beansToUpdate, setBeansToUpdate] = useState<Modifier[]>([]);
	const [beansToSave, setBeansToSave] = useState<Modifier[]>([]);

	const beansMinusDeleted = useMemo(() => {
		return beans?.modifiers.filter(
			(bean) => !beansToDelete.some(({ id }) => id === bean.id),
		);
	}, [beans, beansToDelete]);

	const newBeansSelection = useMemo(() => {
		const beansMinusUpdated = beansMinusDeleted?.filter(
			(bean) => !beansToUpdate.some(({ id }) => id === bean.id),
		);

		if (beansMinusUpdated)
			return [...beansMinusUpdated, ...beansToUpdate, ...beansToSave];
		return [...beansToUpdate, ...beansToSave];
	}, [beansMinusDeleted, beansToUpdate, beansToSave]);

	const onClear = () => {
		setEditedBean(null);
		setNewBean(null);
		setBeanToEdit(null);
	};

	const onCloseDrawer = () => {
		onClear();
		setBeansToDelete([]);
		props.onClose();
	};

	const onEditBean = () =>
		setEditedBean(
			beans?.modifiers.find((modifier) => modifier.id === beanToEdit),
		);

	const onAddNewBean = () =>
		setNewBean({
			id: uuid(),
			label: "",
			description: "",
			is_ingredient: true,
			is_in_stock: true,
		});

	const onDeleteBean = () => {
		const beanToDelete = beans?.modifiers.find(
			(modifier) => modifier.id === beanToEdit,
		);
		if (beanToDelete) {
			setBeansToDelete((prevBeans) => {
				const findBean = prevBeans?.find(
					(modifier) => modifier.id === beanToEdit,
				);
				if (findBean) return prevBeans;
				return [...prevBeans, beanToDelete];
			});
			onClear();
		}
	};

	const onUndoDelete = (beanId: string) =>
		setBeansToDelete(beansToDelete.filter((bean) => bean.id !== beanId));

	const onUpdateBean = () => {
		if (editedBean) {
			setBeansToUpdate((prevBeans) => {
				const findBean = prevBeans?.find(
					(modifier) => modifier.id === beanToEdit,
				);
				if (findBean) {
					const filterBeans = prevBeans?.filter(
						(modifier) => modifier.id === beanToEdit,
					);
					return [...filterBeans, editedBean];
				}
				return [...prevBeans, editedBean];
			});
			onClear();
		}
	};

	const onSaveBean = () => {
		if (newBean) {
			setBeansToSave((prevBeans) => {
				const findBean = prevBeans?.find(
					(modifier) => modifier.id === beanToEdit,
				);
				if (findBean) {
					const filterBeans = prevBeans?.filter(
						(modifier) => modifier.id === beanToEdit,
					);
					return [...filterBeans, newBean];
				}
				return [...prevBeans, newBean];
			});
			onClear();
		}
	};

	const onSaveSelection = () => {
		// delete beans
		beansToDelete.forEach((bean) => {
			dispatch(deleteModifier(bean.id))
				.then(
					(data) =>
						data.payload &&
						notifications.show({
							withCloseButton: false,
							message: `Successfully deleted ${bean.label}`,
							position: "bottom-right",
							color: "green",
						}),
				)
				.catch((error) => {
					console.error(error);
					notifications.show({
						withCloseButton: false,
						message: error.message,
						title: error.name,
						position: "bottom-right",
						color: "red",
					});
				});
		});
		// update beans
		beansToUpdate.forEach((bean) => {
			dispatch(updateModifier(bean))
				.then(
					(data) =>
						data.payload &&
						notifications.show({
							withCloseButton: false,
							message: `Successfully updated ${bean.label}`,
							position: "bottom-right",
							color: "green",
						}),
				)
				.catch((error) => {
					console.error(error);
					notifications.show({
						withCloseButton: false,
						message: error.message,
						title: error.name,
						position: "bottom-right",
						color: "red",
					});
				});
		});
		// save beans
		beansToSave.forEach((bean) => {
			dispatch(insertModifier({ modifier: bean, optionId: beansOptionsId }))
				.then(
					(data) =>
						data.payload &&
						notifications.show({
							withCloseButton: false,
							message: `Successfully created ${bean.label}`,
							position: "bottom-right",
							color: "green",
						}),
				)
				.catch((error) => {
					console.error(error);
					notifications.show({
						withCloseButton: false,
						message: error.message,
						title: error.name,
						position: "bottom-right",
						color: "red",
					});
				});
		});
		dispatch(fetchItemOptions());
		onCloseDrawer();
	};

	if (!isLoading)
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
						UPDATE BEANS
					</Text>

					{editedBean && (
						<Stack w="100%">
							<TextInput
								label="Label"
								value={editedBean.label}
								onChange={(event) =>
									setEditedBean({
										...editedBean,
										label: event.target.value,
									})
								}
							/>
							<TextInput
								label="Description"
								value={editedBean.description}
								onChange={(event) =>
									setEditedBean({
										...editedBean,
										description: event.target.value,
									})
								}
							/>

							<Group grow>
								<StyledButton
									label="Cancel"
									variant="outline"
									onClick={onClear}
								/>
								<StyledButton label="Save" onClick={onUpdateBean} />
							</Group>
						</Stack>
					)}

					{newBean && (
						<Stack w="100%">
							<TextInput
								label="Label"
								value={newBean.label}
								onChange={(event) =>
									setNewBean({
										...newBean,
										label: event.target.value,
									})
								}
							/>
							<TextInput
								label="Description"
								value={newBean.description}
								onChange={(event) =>
									setNewBean({
										...newBean,
										description: event.target.value,
									})
								}
							/>

							<Group grow>
								<StyledButton
									label="Cancel"
									variant="outline"
									onClick={onClear}
								/>
								<StyledButton label="Save" onClick={onSaveBean} />
							</Group>
						</Stack>
					)}

					{!editedBean && !newBean && (
						<Stack w="100%">
							<Text ta="left">{beans?.label}</Text>
							<Select
								data={beansMinusDeleted?.map((bean) => ({
									value: bean.id,
									label: bean.label,
								}))}
								value={beanToEdit}
								onChange={setBeanToEdit}
							/>

							<Group grow>
								<StyledButton
									variant="outline"
									label="Add New"
									onClick={onAddNewBean}
								/>

								<StyledButton
									label="Delete"
									onClick={onDeleteBean}
									isDisabled={!beanToEdit}
								/>
								<StyledButton
									label="Edit"
									onClick={onEditBean}
									isDisabled={!beanToEdit}
								/>
							</Group>
						</Stack>
					)}

					{newBeansSelection.length > 0 && (
						<>
							<Divider w="100%" />

							<Text size="lg" ta="center" w="100%">
								Review Summary
							</Text>

							<Stack w="100%" gap="xs">
								<Text>New Selection</Text>
								<Stack w="100%" gap="0" bdrs="sm" bd="solid 1px darkslategray">
									{newBeansSelection.map((bean, index) => (
										<>
											{index !== 0 && <Divider my="0" />}
											<Stack key={bean.id} gap="0" p="sm">
												<Text fw="bold">{bean.label}</Text>
												<Text>{bean.description}</Text>
											</Stack>
										</>
									))}
								</Stack>
							</Stack>

							{beansToDelete.length > 0 && (
								<>
									<Divider w="100%" />
									<Stack w="100%" gap="xs">
										<Text>Removed from selection</Text>
										<Stack w="100%" gap="0" bdrs="sm" bd="solid 1px crimson">
											{beansToDelete.map((bean, index) => (
												<>
													{index !== 0 && <Divider my="0" />}
													<Flex align="center" justify="space-between" px="sm">
														<Stack key={bean.id} gap="0" p="sm">
															<Text fw="bold">{bean.label}</Text>
															<Text>{bean.description}</Text>
														</Stack>

														<StyledButton
															label="Undo"
															variant="outline"
															onClick={() => onUndoDelete(bean.id)}
														/>
													</Flex>
												</>
											))}
										</Stack>
									</Stack>
								</>
							)}

							<Group grow w="100%">
								<StyledButton
									label="Cancel"
									variant="outline"
									onClick={onCloseDrawer}
								/>
								<StyledButton
									label="Save Selection"
									onClick={onSaveSelection}
								/>
							</Group>
						</>
					)}
				</Stack>
			</Drawer>
		);
}

export default UpdateBeansDrawer;
