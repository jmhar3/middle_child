import { useMemo, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Badge, Group, Modal, Stack, Text } from "@mantine/core";

import StyledButton from "../../StyledButton";
import UpdateStockDrawer from "../manageMenu/UpdateStockDrawer";

import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { updateStoreInfo } from "../../../state/storeInfo/storeInfoThunks";
import { selectAllIngredients } from "../../../state/modifiers/modifiersSlice";
import { selectMenu } from "../../../state/menu/menuSlice";

import {
	selectStoreInfo,
	selectStoreIsOpen,
} from "../../../state/storeInfo/storeInfoSlice";

interface ToggleStoreOpenModalProps {
	isOpen: boolean;
	onClose: () => void;
}

function ToggleStoreOpenModal(props: ToggleStoreOpenModalProps) {
	const { isOpen, onClose } = props;

	const dispatch = useAppDispatch();
	const storeInfo = useAppSelector(selectStoreInfo);
	const storeIsOpen = useAppSelector(selectStoreIsOpen);
	const menu = useAppSelector(selectMenu);
	const ingredients = useAppSelector(selectAllIngredients);
	const menuItems = menu.flatMap((menuSection) => menuSection.items);

	const [
		showUpdateStockDrawer,
		{ open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
	] = useDisclosure(false);

	const [isUpdatingStore, setIsUpdatingStore] = useState(false);

	const outOfStock = useMemo(() => {
		const existingOutOfStockSections = menu.filter(
			(section) => !section.is_in_stock,
		);
		const existingOutOfStockIngredients = ingredients.filter(
			(ingredient) => !ingredient.is_in_stock,
		);
		const existingOutOfStockMenuItems = menuItems.filter(
			(item) => !item.is_in_stock,
		);
		return [
			existingOutOfStockSections,
			existingOutOfStockIngredients,
			existingOutOfStockMenuItems,
		].flat();
	}, [menu, ingredients, menuItems]);

	const onUpdateStore = () => {
		setIsUpdatingStore(true);
		dispatch(updateStoreInfo({ ...storeInfo, is_open: !storeIsOpen }))
			.catch((error) =>
				notifications.show({
					message: error,
					withCloseButton: false,
					position: "bottom-right",
					color: "red",
				}),
			)
			.finally(() => {
				setIsUpdatingStore(false);
			});
		onClose();
	};

	return (
		<Modal
			pt="6em"
			centered
			radius="sm"
			opened={isOpen}
			onClose={onClose}
			withCloseButton={false}
			size={outOfStock.length > 0 ? "lg" : "md"}
			transitionProps={{ transition: "fade", duration: 200 }}
			styles={{
				content: { background: "whitesmoke" },
			}}
		>
			<Stack>
				<Text size="1.2em" c="darkslategray" fw="600">
					{storeIsOpen
						? "Are you sure you want to stop accepting orders?"
						: "Are you ready to start accepting orders?"}
				</Text>

				{outOfStock.length > 0 ? (
					<Stack p="sm" my="xs" bg="white" bdrs="md" bd="1px solid crimson">
						<Text ta="center" c="crimson" fs="initial">
							Warning: Items are marked out of stock
						</Text>

						<Group gap="sm">
							{outOfStock.map((item) => (
								<Badge
									key={item.id}
									size="lg"
									variant="light"
									color="darkslategray"
								>
									{item.label}
								</Badge>
							))}
						</Group>

						<StyledButton
							label="Manage Stock"
							onClick={openUpdateStockDrawer}
							isDisabled={isUpdatingStore}
						/>

						<UpdateStockDrawer
							isOpen={showUpdateStockDrawer}
							onClose={closeUpdateStockDrawer}
						/>
					</Stack>
				) : (
					""
				)}

				<Group grow>
					<StyledButton
						label="Confirm"
						onClick={onUpdateStore}
						isLoading={isUpdatingStore}
					/>
					<StyledButton
						label="Cancel"
						variant="outline"
						onClick={onClose}
						isLoading={isUpdatingStore}
					/>
				</Group>
			</Stack>
		</Modal>
	);
}

export default ToggleStoreOpenModal;
