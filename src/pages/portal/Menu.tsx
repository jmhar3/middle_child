import PageLayout from "./PageLayout";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import {
  Accordion,
  Divider,
  Flex,
  Group,
  MultiSelect,
  Stack,
  Text,
} from "@mantine/core";

import StyledButton from "../../components/StyledButton";
import EditableMenuItem from "../../components/portal/EditableMenuItem";
import UpdateStockDrawer from "../../components/portal/UpdateStockDrawer";

import { menu, modifierCategories } from "../../helpers/menu";

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
        <>
          <StyledButton
            variant="outline"
            label="Update Stock"
            onClick={openUpdateStockDrawer}
          />
          <StyledButton
            variant="outline"
            label="Preview Menu"
            onClick={openUpdateStockDrawer}
          />
        </>
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
          <Accordion.Item key={section.label} value={section.label}>
            <Accordion.Control>
              <Text component="span">{section.label.toUpperCase()}</Text>
            </Accordion.Control>

            <Accordion.Panel>
              <Stack>
                <Flex
                  w="100%"
                  p="sm"
                  gap="sm"
                  align="flex-end"
                  justify="space-between"
                >
                  <MultiSelect
                    size="md"
                    searchable
                    label="Default Modifiers"
                    defaultValue={["1", "2", "3", "4"]}
                    data={modifierCategories.map((category) => ({
                      value: category.label,
                      label: category.label,
                    }))}
                  />

                  <Divider orientation="vertical" />

                  <StyledButton label="Add Menu Item" onClick={() => {}} />
                </Flex>

                <Stack gap="0">
                  {section.items.map((menuItem) => (
                    <>
                      <Divider />
                      <EditableMenuItem menuItem={menuItem} />
                    </>
                  ))}
                </Stack>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </PageLayout>
  );
}

export default Menu;

// const ProtectedPortal = withAuthenticationRequired(Menu);

// export default ProtectedPortal;
