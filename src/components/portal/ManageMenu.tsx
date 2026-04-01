import { Button, em, Menu } from "@mantine/core";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";

import UpdateStockDrawer from "../../components/portal/UpdateStockDrawer";
import UpsertSectionModal from "../../components/portal/menu/UpsertSectionModal";
import UpsertModifierDrawer from "../../components/portal/menu/UpsertModifierDrawer";
import UpsertItemOptionDrawer from "../../components/portal/menu/UpsertItemOptionDrawer";

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
    showUpsertModifierDrawer,
    { open: openUpsertModifierDrawer, close: closeUpsertModifierDrawer },
  ] = useDisclosure(false);
  const [
    showUpsertItemOptionDrawer,
    { open: openUpsertItemOptionDrawer, close: closeUpsertItemOptionDrawer },
  ] = useDisclosure(false);

  return (
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

        <UpdateStockDrawer
          isOpen={showUpdateStockDrawer}
          onClose={closeUpdateStockDrawer}
        />

        <Menu.Divider />
        <Menu.Label>Menu Sections</Menu.Label>
        <Menu.Item onClick={openUpsertSectionModal}>Add Section</Menu.Item>
        <Menu.Item>Reorder Menu</Menu.Item>

        <UpsertSectionModal
          isOpen={showUpsertSectionModal}
          onClose={closeUpsertSectionModal}
        />

        <Menu.Divider />
        <Menu.Label>Item Modifiers</Menu.Label>
        <Menu.Item onClick={openUpsertModifierDrawer}>Add Modifier</Menu.Item>
        <Menu.Item onClick={openUpsertModifierDrawer}>Edit Modifier</Menu.Item>
        <Menu.Item>Remove Modifier</Menu.Item>

        <UpsertModifierDrawer
          isOpen={showUpsertModifierDrawer}
          onClose={closeUpsertModifierDrawer}
        />

        <Menu.Divider />
        <Menu.Label>Item Options</Menu.Label>
        <Menu.Item onClick={openUpsertItemOptionDrawer}>Add Options</Menu.Item>
        <Menu.Item onClick={openUpsertItemOptionDrawer}>Edit Options</Menu.Item>
        <Menu.Item>Remove Options</Menu.Item>

        <UpsertItemOptionDrawer
          isOpen={showUpsertItemOptionDrawer}
          onClose={closeUpsertItemOptionDrawer}
        />
      </Menu.Dropdown>
    </Menu>
  );
}

export default ManageMenu;
