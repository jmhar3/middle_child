import { Button, em, Menu } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";

import UpdateStockDrawer from "./UpdateStockDrawer";
import UpdateOrderTimesModal from "./UpdateOrderTimesModal";
import UpdateBeansDrawer from "./UpdateBeansDrawer";
import UpdatePricesDrawer from "./UpdatePricesDrawer";
import UpdateOpeningHoursModal from "./UpdateOpeningHoursDrawer";
// import ManageItemsDrawer from "./ManageItemsDrawer";
// import ManageModifiersDrawer from "./ManageModifiersDrawer";
// import ManageOptionsDrawer from "./ManageOptionsDrawer";
// import ManageSectionsDrawer from "./ManageSectionsDrawer";

function ManageMenu() {
	const isMobile = useMediaQuery(`(max-width: ${em(815)})`);

	const [
		showUpdateStockDrawer,
		{ open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
	] = useDisclosure(false);
	const [
		showUpdateBeansDrawer,
		{ open: openUpdateBeansDrawer, close: closeUpdateBeansDrawer },
	] = useDisclosure(false);
	const [
		showUpdatePricesDrawer,
		{ open: openUpdatePricesDrawer, close: closeUpdatePricesDrawer },
	] = useDisclosure(false);
	const [
		showUpdateOrderTimesDrawer,
		{ open: openUpdateOrderTimesDrawer, close: closeUpdateOrderTimesDrawer },
	] = useDisclosure(false);
	const [
		showUpdateOpeningHoursDrawer,
		{
			open: openUpdateOpeningHoursDrawer,
			close: closeUpdateOpeningHoursDrawer,
		},
	] = useDisclosure(false);
	// const [
	// 	showManageItemsDrawer,
	// 	{ open: openManageItemsDrawer, close: closeManageItemsDrawer },
	// ] = useDisclosure(false);
	// const [
	// 	showManageModifiersDrawer,
	// 	{ open: openManageModifiersDrawer, close: closeManageModifiersDrawer },
	// ] = useDisclosure(false);
	// const [
	// 	showManageOptionsDrawer,
	// 	{ open: openManageOptionsDrawer, close: closeManageOptionsDrawer },
	// ] = useDisclosure(false);
	// const [
	// 	showManageSectionsDrawer,
	// 	{ open: openManageSectionsDrawer, close: closeManageSectionsDrawer },
	// ] = useDisclosure(false);

	return (
		<>
			<Menu shadow="md" position="bottom-end">
				<Menu.Target>
					<Button
						px="lg"
						variant="outline"
						color="darkslategray"
						size={isMobile ? "md" : "lg"}
					>
						Manage Menu
					</Button>
				</Menu.Target>

				<Menu.Dropdown pos="absolute">
					<Menu.Label>Update</Menu.Label>

					<Menu.Item onClick={openUpdateStockDrawer}>Stock</Menu.Item>
					<Menu.Item onClick={openUpdateBeansDrawer}>Beans</Menu.Item>
					<Menu.Item onClick={openUpdatePricesDrawer}>Prices</Menu.Item>
					<Menu.Item onClick={openUpdateOrderTimesDrawer}>
						Order Times
					</Menu.Item>
					<Menu.Item onClick={openUpdateOpeningHoursDrawer}>
						Opening Hours
					</Menu.Item>
					{/*
					<Menu.Divider />

					<Menu.Label>Create/Edit/Delete</Menu.Label>

					<Menu.Item onClick={openManageSectionsDrawer}>
						Menu Sections
					</Menu.Item>
					<Menu.Item onClick={openManageItemsDrawer}>Menu Items</Menu.Item>
					<Menu.Item onClick={openManageModifiersDrawer}>
						Item Modifiers
					</Menu.Item>
					<Menu.Item onClick={openManageOptionsDrawer}>Item Options</Menu.Item>*/}
				</Menu.Dropdown>
			</Menu>

			<UpdateStockDrawer
				isOpen={showUpdateStockDrawer}
				onClose={closeUpdateStockDrawer}
			/>

			<UpdateBeansDrawer
				isOpen={showUpdateBeansDrawer}
				onClose={closeUpdateBeansDrawer}
			/>

			<UpdatePricesDrawer
				isOpen={showUpdatePricesDrawer}
				onClose={closeUpdatePricesDrawer}
			/>

			<UpdateOrderTimesModal
				isOpen={showUpdateOrderTimesDrawer}
				onClose={closeUpdateOrderTimesDrawer}
			/>

			<UpdateOpeningHoursModal
				isOpen={showUpdateOpeningHoursDrawer}
				onClose={closeUpdateOpeningHoursDrawer}
			/>

			{/*<ManageItemsDrawer
				isOpen={showManageItemsDrawer}
				onClose={closeManageItemsDrawer}
			/>

			<ManageModifiersDrawer
				isOpen={showManageModifiersDrawer}
				onClose={closeManageModifiersDrawer}
			/>

			<ManageOptionsDrawer
				isOpen={showManageOptionsDrawer}
				onClose={closeManageOptionsDrawer}
			/>

			<ManageSectionsDrawer
				isOpen={showManageSectionsDrawer}
				onClose={closeManageSectionsDrawer}
			/>*/}
		</>
	);
}

export default ManageMenu;
