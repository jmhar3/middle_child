import { Button, em, Menu } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";

import UpdateStockDrawer from "./UpdateStockDrawer";
import UpsertSectionModal from "./menu/sections/UpsertSectionModal";
import UpdateModifierDrawer from "./menu/modifiers/UpdateModifierDrawer";
import InsertModifierDrawer from "./menu/modifiers/InsertModifierDrawer";
import DeleteModifierModal from "./menu/modifiers/DeleteModifierModal";
import InsertOptionDrawer from "./menu/itemOptions/InsertOptionDrawer";
import UpdateOptionDrawer from "./menu/itemOptions/UpdateOptionDrawer";

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
          <Menu.Item onClick={openUpdateStockDrawer}>Update Stock</Menu.Item>

          <Menu.Divider />

          <Menu.Label>Menu Sections</Menu.Label>
          <Menu.Item onClick={openUpsertSectionModal}>Add Section</Menu.Item>

          <Menu.Divider />

          <Menu.Label>Item Modifiers</Menu.Label>
          <Menu.Item onClick={openInsertModifierDrawer}>Add Modifier</Menu.Item>
          <Menu.Item onClick={openUpdateModifierDrawer}>
            Edit Modifier
          </Menu.Item>
          <Menu.Item onClick={openDeleteModifierModal}>
            Remove Modifier
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Item Options</Menu.Label>
          <Menu.Item onClick={openInsertOptionDrawer}>Add Options</Menu.Item>
          <Menu.Item onClick={openUpdateOptionDrawer}>Edit Options</Menu.Item>
          <Menu.Item>Remove Options</Menu.Item>
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
    </>
  );
}

export default ManageMenu;
