import PageLayout from "./PageLayout";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
// import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Group, Accordion } from "@mantine/core";

import StyledButton from "../../components/StyledButton";
import UpdateStockDrawer from "../../components/portal/UpdateStockDrawer";
import Section from "../../components/portal/Menu/Section";

import { menu } from "../../helpers/menu";

function Menu() {
  const [
    showUpdateStockDrawer,
    { open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
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
          <StyledButton label="Add Section" onClick={() => {}} />
          <StyledButton label="Add/Edit Modifier" onClick={() => {}} />
          <StyledButton label="Add/Edit Modifier Category" onClick={() => {}} />
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
