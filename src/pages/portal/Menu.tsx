import { useEffect, useState } from "react";
import PageLayout from "./PageLayout";
import { useDisclosure } from "@mantine/hooks";
import { Group, Accordion } from "@mantine/core";
import { notifications } from "@mantine/notifications";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import Loading from "../../components/Loading";
import StyledButton from "../../components/StyledButton";
import Section from "../../components/portal/menu/Section"; //
import UpdateStockDrawer from "../../components/portal/UpdateStockDrawer";
import CreateSectionDrawer from "../../components/portal/menu/CreateSectionDrawer"; //
import UpsertModifierDrawer from "../../components/portal/menu/UpsertModifierDrawer"; //
import UpsertItemOptionDrawer from "../../components/portal/menu/UpsertItemOptionDrawer"; //

import { fetchModifiers, menu as hardcodedMenu } from "../../helpers/menu";

import type { ItemOptions, MenuSection, Modifier } from "../../helpers/menu";

function Menu() {
  const [
    showUpdateStockDrawer,
    { open: openUpdateStockDrawer, close: closeUpdateStockDrawer },
  ] = useDisclosure(false);
  const [
    showAddSectionDrawer,
    { open: openAddSectionDrawer, close: closeAddSectionDrawer },
  ] = useDisclosure(false);
  const [
    showUpsertModifierDrawer,
    { open: openUpsertModifierDrawer, close: closeUpsertModifierDrawer },
  ] = useDisclosure(false);
  const [
    showUpsertItemOptionDrawer,
    { open: openUpsertItemOptionDrawer, close: closeUpsertItemOptionDrawer },
  ] = useDisclosure(false);

  const [menu, setMenu] = useState<MenuSection[]>(hardcodedMenu);
  const [modifiers, setModifiers] = useState<Modifier[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchModifiers()
      .then((data) => setModifiers(data))
      .catch((error) =>
        notifications.show({
          message: error,
          withCloseButton: false,
          position: "bottom-right",
          color: "red",
        }),
      )
      .finally(() => setIsLoading(false));
  }, []);

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

  const onModifierUpsert = (modifier: Modifier) => {
    setModifiers((prevModifiers) => {
      if (prevModifiers) {
        const modifiersWithoutUpsertModifier = prevModifiers.filter(
          (prevModifier) => prevModifier.id !== modifier.id,
        );
        return [...modifiersWithoutUpsertModifier, modifier];
      }
    });
    closeUpsertModifierDrawer();
  };

  const onUpsertItemOption = (itemOption: ItemOptions) => {
    console.log(itemOption);
    closeUpsertItemOptionDrawer();
  };

  const onDeleteSection = (sectionToDelete: MenuSection) => {
    setMenu((prevMenu) =>
      prevMenu.filter((section) => section !== sectionToDelete),
    );
  };

  if (isLoading) return <Loading message="Loading store data" />;

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
      {modifiers && (
        <UpsertModifierDrawer
          modifiers={modifiers}
          isOpen={showUpsertModifierDrawer}
          onClose={closeUpsertModifierDrawer}
          onModifierUpsert={onModifierUpsert}
        />
      )}
      <UpsertItemOptionDrawer
        isOpen={showUpsertItemOptionDrawer}
        onClose={closeUpsertItemOptionDrawer}
        onUpsertItemOptions={onUpsertItemOption}
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
            onClick={openUpsertModifierDrawer}
          />
          <StyledButton
            label="Add/Edit Modifier Category"
            onClick={openUpsertItemOptionDrawer}
          />
        </Group>

        {menu.map((section) => (
          <Section
            key={section.id}
            section={section}
            onDeleteSection={() => onDeleteSection(section)}
          />
        ))}
      </Accordion>
    </PageLayout>
  );
}

export default Menu;

// const ProtectedPortal = withAuthenticationRequired(Menu);

// export default ProtectedPortal;
