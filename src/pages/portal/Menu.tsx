import PageLayout from "./PageLayout";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import { Accordion, Divider, Flex, Group, Stack, Text } from "@mantine/core";

import StyledButton from "../../components/StyledButton";
import EditableMenuItem from "../../components/portal/EditableMenuItem";
import UpdateStockDrawer from "../../components/portal/UpdateStockDrawer";

import { menu, modifierCategories, modifiers } from "../../helpers/menu";
import EditableMenuSectionModifier from "../../components/portal/EditableMenuSectionModifier";

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
                  p="sm"
                  gap="sm"
                  w="100%"
                  justify="space-between"
                  align="flex-end"
                >
                  <Stack>
                    <EditableMenuSectionModifier
                      label="Default Modifiers"
                      defaultValue={["1", "2", "3", "4"]}
                      data={modifiers.map((category) => ({
                        value: category.id,
                        label: category.label,
                      }))}
                    />

                    <Divider />

                    <EditableMenuSectionModifier
                      label="Default Modifier Categories"
                      defaultValue={["3", "4"]}
                      data={modifierCategories.map((category) => ({
                        value: category.id,
                        label: category.label,
                      }))}
                    />
                  </Stack>

                  <Flex gap="sm" justify="flex-end" h="100%">
                    <Divider orientation="vertical" />

                    <StyledButton label="Add Menu Item" onClick={() => {}} />
                  </Flex>
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
