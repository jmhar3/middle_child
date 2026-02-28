import { useState } from "react";
import PageLayout from "./PageLayout";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
// import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Group, Accordion } from "@mantine/core";

import StyledButton from "../../components/StyledButton";
import Section from "../../components/portal/menu/Section";
import UpdateStockDrawer from "../../components/portal/UpdateStockDrawer";
import CreateSectionDrawer from "../../components/portal/menu/CreateSectionDrawer";
import AddEditModifierDrawer from "../../components/portal/menu/AddEditModifierDrawer";
import AddEditItemOptionDrawer from "../../components/portal/menu/AddEditItemOptionDrawer";

import { menu as hardcodedMenu } from "../../helpers/menu";

import type { ItemOptions, MenuSection, Modifier } from "../../helpers/menu";

function Menu() {
  const [menu, setMenu] = useState<MenuSection[]>(hardcodedMenu);

  const [
    showUpdateStockDrawer,
    { open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
  ] = useDisclosure(false);
  const [
    showAddSectionDrawer,
    { open: openAddSectionDrawer, close: closeAddSectionDrawer },
  ] = useDisclosure(false);
  const [
    showAddEditModifierDrawer,
    { open: openAddEditModifierDrawer, close: closeAddEditModifierDrawer },
  ] = useDisclosure(false);
  const [
    showAddEditItemOptionDrawer,
    { open: openAddEditItemOptionDrawer, close: closeAddEditItemOptionDrawer },
  ] = useDisclosure(false);

  const onUpdateStock = () => {
    closeUpdateStockDrawer();
    notifications.show({
      withCloseButton: false,
      message: "Stock Updated Successfully",
      position: "bottom-right",
      color: "green",
    });
  };

  const onCreateSection = (section: MenuSection) => {
    setMenu((prevMenu) => [...prevMenu, section]);
    closeAddSectionDrawer();
  };

  const onAddEditModifier = (modifier: Modifier) => {
    console.log(modifier);
    closeAddEditModifierDrawer();
  };

  const onAddEditItemOption = (itemOption: ItemOptions) => {
    console.log(itemOption);
    closeAddEditItemOptionDrawer();
  };

  return (
    <PageLayout
      navComponents={
        <StyledButton
          variant="outline"
          label="Update Stock"
          onClick={openUpdateStockDrawer}
        />
      }
    >
      <UpdateStockDrawer
        isOpen={showUpdateStockDrawer}
        onClose={closeUpdateStockDrawer}
        onUpdateStock={onUpdateStock}
      />
      <CreateSectionDrawer
        isOpen={showAddSectionDrawer}
        onClose={closeAddSectionDrawer}
        onCreateSection={onCreateSection}
      />
      <AddEditModifierDrawer
        isOpen={showAddEditModifierDrawer}
        onClose={closeAddEditModifierDrawer}
        onAddEditModifier={onAddEditModifier}
      />
      <AddEditItemOptionDrawer
        isOpen={showAddEditItemOptionDrawer}
        onClose={closeAddEditItemOptionDrawer}
        onAddEditItemOptions={onAddEditItemOption}
      />

      <Accordion
        styles={{
          item: { borderColor: "darkslategray" },
          content: {
            padding: 0,
            margin: 0,
            backgroundColor: "white",
          },
          control: {
            backgroundColor: "whitesmoke",
          },
        }}
      >
        <Group w="100%" grow p="sm" bg="white" style={{ zIndex: -1 }}>
          <StyledButton label="Add Section" onClick={openAddSectionDrawer} />
          <StyledButton
            label="Add/Edit Modifier"
            onClick={openAddEditModifierDrawer}
          />
          <StyledButton
            label="Add/Edit Modifier Category"
            onClick={openAddEditItemOptionDrawer}
          />
        </Group>

        {menu.map((section) => (
          <Section key={section.id} section={section} />
        ))}
      </Accordion>
    </PageLayout>
  );
}

export default Menu;

// const ProtectedPortal = withAuthenticationRequired(Menu);

// export default ProtectedPortal;
