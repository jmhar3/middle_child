import { Button, em, Menu } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";

import UpdateStockDrawer from "./UpdateStockDrawer";
import UpsertSectionModal from "./menu/UpsertSectionModal";
import UpdateModifierDrawer from "./menu/UpdateModifierDrawer";
import InsertModifierDrawer from "./menu/InsertModifierDrawer";
import UpsertItemOptionDrawer from "./menu/UpsertItemOptionDrawer";
import DeleteModifierModal from "./menu/DeleteModifierModal";

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
    showUpsertItemOptionDrawer,
    { open: openUpsertItemOptionDrawer, close: closeUpsertItemOptionDrawer },
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
          <Menu.Item onClick={openUpsertItemOptionDrawer}>
            Add Options
          </Menu.Item>
          <Menu.Item onClick={openUpsertItemOptionDrawer}>
            Edit Options
          </Menu.Item>
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

      <UpsertItemOptionDrawer
        isOpen={showUpsertItemOptionDrawer}
        onClose={closeUpsertItemOptionDrawer}
      />
    </>
  );
}

export default ManageMenu;
