import { useMemo, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Badge, Divider, Group, Modal, Stack, Text } from "@mantine/core";

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

	const [
		showUpdateStockDrawer,
		{ open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
	] = useDisclosure(false);

	const [isUpdatingStore, setIsUpdatingStore] = useState(false);

	const existingOutOfStockSections = useMemo(() => {
		return menu.filter((section) => !section.is_in_stock);
	}, [menu]);

	const existingOutOfStockMenuItems = useMemo(() => {
		return menu
			.flatMap((menuSection) => menuSection.items)
			.filter((item) => !item.is_in_stock);
	}, [menu]);

	const existingOutOfStockIngredients = useMemo(() => {
		return ingredients.filter((ingredient) => !ingredient.is_in_stock);
	}, [ingredients]);

	const outOfStock = useMemo(() => {
		return [
			existingOutOfStockSections,
			existingOutOfStockIngredients,
			existingOutOfStockMenuItems,
		].flat();
	}, [
		existingOutOfStockSections,
		existingOutOfStockIngredients,
		existingOutOfStockMenuItems,
	]);

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
					<Stack
						p="sm"
						my="xs"
						gap="sm"
						bdrs="md"
						bg="white"
						bd="1px solid crimson"
					>
						<Text ta="center" c="crimson" fs="initial">
							Warning: Items are marked out of stock
						</Text>

						{existingOutOfStockSections.length > 0 && (
							<>
								<Divider />
								<Stack gap="xs">
									<Text>Sections:</Text>
									<Group gap="sm">
										{existingOutOfStockSections.map((item) => (
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
								</Stack>
							</>
						)}

						{existingOutOfStockIngredients.length > 0 && (
							<>
								<Divider />
								<Stack gap="xs">
									<Text>Ingredients:</Text>
									<Group gap="sm">
										{existingOutOfStockIngredients.map((item) => (
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
								</Stack>
							</>
						)}

						{existingOutOfStockMenuItems.length > 0 && (
							<>
								<Divider />
								<Stack gap="xs">
									<Text>Menu Items:</Text>
									<Group gap="sm">
										{existingOutOfStockMenuItems.map((item) => (
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
								</Stack>
							</>
						)}

						<Divider />

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
