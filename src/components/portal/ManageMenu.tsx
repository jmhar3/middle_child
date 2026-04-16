import { Button, em, Menu } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";

import UpdateStockDrawer from "./UpdateStockDrawer";
import UpsertSectionModal from "./menu/sections/UpsertSectionModal";
import UpdateModifierDrawer from "./menu/modifiers/UpdateModifierDrawer";
import InsertModifierDrawer from "./menu/modifiers/InsertModifierDrawer";
import DeleteModifierModal from "./menu/modifiers/DeleteModifierModal";
import InsertOptionDrawer from "./menu/itemOptions/InsertOptionDrawer";
import UpdateOptionDrawer from "./menu/itemOptions/UpdateOptionDrawer";
import UpdateOrderTimesModal from "./UpdateOrderTimesModal";

function ManageMenu() {
  const isMobile = useMediaQuery(`(max-width: ${em(815)})`);

  const [
    showUpdateStockDrawer,
    { open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
  ] = useDisclosure(false);
  const [
    showUpsertSectionModal,
    { open: openUpsertSectionModal, close: closeUpsertSectionModal },
  ] = useDisclosure(false);
  const [
    showInsertModifierDrawer,
    { open: openInsertModifierDrawer, close: closeInsertModifierDrawer },
  ] = useDisclosure(false);
  const [
    showUpdateModifierDrawer,
    { open: openUpdateModifierDrawer, close: closeUpdateModifierDrawer },
  ] = useDisclosure(false);
  const [
    showDeleteModifierModal,
    { open: openDeleteModifierModal, close: closeDeleteModifierModal },
  ] = useDisclosure(false);
  const [
    showInsertOptionDrawer,
    { open: openInsertOptionDrawer, close: closeInsertOptionDrawer },
  ] = useDisclosure(false);
  const [
    showUpdateOptionDrawer,
    { open: openUpdateOptionDrawer, close: closeUpdateOptionDrawer },
  ] = useDisclosure(false);
  const [
    showUpdateOrderTimesDrawer,
    { open: openUpdateOrderTimesDrawer, close: closeUpdateOrderTimesDrawer },
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
            Manage Store
          </Button>
        </Menu.Target>

        <Menu.Dropdown pos="absolute">
          <Menu.Item onClick={openUpdateStockDrawer}>Update Stock</Menu.Item>
          <Menu.Item onClick={openUpdateOrderTimesDrawer}>
            Update Order Times
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item onClick={openUpsertSectionModal}>Add Section</Menu.Item>

          <Menu.Divider />

          <Menu.Sub openDelay={120} closeDelay={150}>
            <Menu.Sub.Target>
              <Menu.Sub.Item>Edit Menu Items</Menu.Sub.Item>
            </Menu.Sub.Target>

            <Menu.Sub.Dropdown>
              <Menu.Item onClick={openInsertModifierDrawer}>
                Duplicate Item
              </Menu.Item>
              <Menu.Item onClick={openUpdateModifierDrawer}>
                Mass Update Items
              </Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>

          <Menu.Divider />

          <Menu.Sub openDelay={120} closeDelay={150}>
            <Menu.Sub.Target>
              <Menu.Sub.Item>Edit Modifiers</Menu.Sub.Item>
            </Menu.Sub.Target>

            <Menu.Sub.Dropdown>
              <Menu.Item onClick={openInsertModifierDrawer}>
                Add Modifier
              </Menu.Item>
              <Menu.Item onClick={openUpdateModifierDrawer}>
                Edit Modifier
              </Menu.Item>
              <Menu.Item onClick={openDeleteModifierModal}>
                Remove Modifier
              </Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>

          <Menu.Divider />

          <Menu.Sub openDelay={120} closeDelay={150}>
            <Menu.Sub.Target>
              <Menu.Sub.Item>Edit Options</Menu.Sub.Item>
            </Menu.Sub.Target>

            <Menu.Sub.Dropdown>
              <Menu.Item onClick={openInsertOptionDrawer}>
                Add Options
              </Menu.Item>
              <Menu.Item onClick={openUpdateOptionDrawer}>
                Edit Options
              </Menu.Item>
              <Menu.Item>Remove Options</Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>

          <Menu.Divider />

          <Menu.Sub openDelay={120} closeDelay={150}>
            <Menu.Sub.Target>
              <Menu.Sub.Item>Reorder</Menu.Sub.Item>
            </Menu.Sub.Target>

            <Menu.Sub.Dropdown>
              <Menu.Item>Sort Sections</Menu.Item>
              <Menu.Item>Sort Menu Items</Menu.Item>
              <Menu.Item>Sort Options</Menu.Item>
              <Menu.Item>Sort Options Modifiers</Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>
        </Menu.Dropdown>
      </Menu>

      <UpdateStockDrawer
        isOpen={showUpdateStockDrawer}
        onClose={closeUpdateStockDrawer}
      />

      <UpsertSectionModal
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
      />

      <UpdateOrderTimesModal
        isOpen={showUpdateOrderTimesDrawer}
        onClose={closeUpdateOrderTimesDrawer}
      />
    </>
  );
}

export default ManageMenu;
