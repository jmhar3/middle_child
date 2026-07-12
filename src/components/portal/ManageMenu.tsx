import { Button, em, Menu } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";

import UpdateStockDrawer from "./update/UpdateStockDrawer";
// import UpsertSectionModal from "./menu/sections/UpsertSectionModal";
// import UpdateModifierDrawer from "./menu/modifiers/UpdateModifierDrawer";
// import InsertModifierDrawer from "./menu/modifiers/InsertModifierDrawer";
// import DeleteModifierModal from "./menu/modifiers/DeleteModifierModal";
// import InsertOptionDrawer from "./menu/itemOptions/InsertOptionDrawer";
// import UpdateOptionDrawer from "./menu/itemOptions/UpdateOptionDrawer";
import UpdateOrderTimesModal from "./update/UpdateOrderTimesModal";
import UpdateBeansDrawer from "./update/UpdateBeansDrawer";
import UpdatePricesDrawer from "./update/UpdatePricesDrawer";
import UpdateOpeningHoursModal from "./update/UpdateOpeningHoursDrawer";

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
	// const [
	//   showUpsertSectionModal,
	//   { open: openUpsertSectionModal, close: closeUpsertSectionModal },
	// ] = useDisclosure(false);
	// const [
	//   showInsertModifierDrawer,
	//   { open: openInsertModifierDrawer, close: closeInsertModifierDrawer },
	// ] = useDisclosure(false);
	// const [
	//   showUpdateModifierDrawer,
	//   { open: openUpdateModifierDrawer, close: closeUpdateModifierDrawer },
	// ] = useDisclosure(false);
	// const [
	//   showDeleteModifierModal,
	//   { open: openDeleteModifierModal, close: closeDeleteModifierModal },
	// ] = useDisclosure(false);
	// const [
	//   showInsertOptionDrawer,
	//   { open: openInsertOptionDrawer, close: closeInsertOptionDrawer },
	// ] = useDisclosure(false);
	// const [
	//   showUpdateOptionDrawer,
	//   { open: openUpdateOptionDrawer, close: closeUpdateOptionDrawer },
	// ] = useDisclosure(false);
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

          <Menu.Sub openDelay={120} closeDelay={150}>
            <Menu.Sub.Target>
              <Menu.Sub.Item>Create</Menu.Sub.Item>
            </Menu.Sub.Target>

            <Menu.Sub.Dropdown>
              <Menu.Item onClick={() => {}}>Section</Menu.Item>
              <Menu.Item onClick={() => {}}>Item</Menu.Item>
              <Menu.Item onClick={() => {}}>Modifier</Menu.Item>
              <Menu.Item onClick={() => {}}>Options</Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>

          <Menu.Divider />

          <Menu.Sub openDelay={120} closeDelay={150}>
            <Menu.Sub.Target>
              <Menu.Sub.Item>Edit</Menu.Sub.Item>
            </Menu.Sub.Target>

            <Menu.Sub.Dropdown>
              <Menu.Item onClick={() => {}}>Section</Menu.Item>
              <Menu.Item onClick={() => {}}>Item</Menu.Item>
              <Menu.Item onClick={() => {}}>Modifier</Menu.Item>
              <Menu.Item onClick={() => {}}>Options</Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>

          <Menu.Divider />

          <Menu.Sub openDelay={120} closeDelay={150}>
            <Menu.Sub.Target>
              <Menu.Sub.Item>Reorder</Menu.Sub.Item>
            </Menu.Sub.Target>

            <Menu.Sub.Dropdown>
              <Menu.Item>Sections</Menu.Item>
              <Menu.Item>Items</Menu.Item>
              <Menu.Item>Modifiers</Menu.Item>
              <Menu.Item>Options</Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>*/}
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

			{/*<UpsertSectionModal
        isOpen={showUpsertSectionModal}
        onClose={closeUpsertSectionModal}
      />

      <UpdateModifierDrawer
        isOpen={showUpdateModifierDrawer}
        onClose={closeUpdateModifierDrawer}
      />

      <InsertModifierDrawer
        isOpen={showInsertModifierDrawer}
        onClose={closeInsertModifierDrawer}
      />

      <DeleteModifierModal
        isOpen={showDeleteModifierModal}
        onClose={closeDeleteModifierModal}
      />

      <InsertOptionDrawer
        isOpen={showInsertOptionDrawer}
        onClose={closeInsertOptionDrawer}
      />

      <UpdateOptionDrawer
        isOpen={showUpdateOptionDrawer}
        onClose={closeUpdateOptionDrawer}
      />*/}

			<UpdateOrderTimesModal
				isOpen={showUpdateOrderTimesDrawer}
				onClose={closeUpdateOrderTimesDrawer}
			/>

			<UpdateOpeningHoursModal
				isOpen={showUpdateOpeningHoursDrawer}
				onClose={closeUpdateOpeningHoursDrawer}
			/>
		</>
	);
}

export default ManageMenu;
