import { useEffect } from "react";
import PageLayout from "./PageLayout";
import { useDisclosure } from "@mantine/hooks";
import { Group, Accordion } from "@mantine/core";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

import Loading from "../../components/Loading";
import StyledButton from "../../components/StyledButton";
import Section from "../../components/portal/menu/Section";
import UpdateStockDrawer from "../../components/portal/UpdateStockDrawer";
import UpsertSectionModal from "../../components/portal/menu/UpsertSectionModal";
import UpsertModifierDrawer from "../../components/portal/menu/UpsertModifierDrawer";
import UpsertItemOptionDrawer from "../../components/portal/menu/UpsertItemOptionDrawer";

import { fetchMenu } from "../../state/menu/menuThunks";
import { fetchModifiers } from "../../state/modifiers/modifierThunks";
import { fetchItemOptions } from "../../state/itemOptions/itemOptionThunks";

import { selectMenu, selectMenuStatus } from "../../state/menu/menuSlice";
import { selectModifiersStatus } from "../../state/modifiers/modifiersSlice";
import { selectItemOptionsStatus } from "../../state/itemOptions/itemOptionsSlice";

import { useAppDispatch, useAppSelector } from "../../state/hooks";

function Menu() {
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

  const dispatch = useAppDispatch();
  const menu = useAppSelector(selectMenu);
  const menuStatus = useAppSelector(selectMenuStatus);
  const modifiersStatus = useAppSelector(selectModifiersStatus);
  const itemOptionsStatus = useAppSelector(selectItemOptionsStatus);

  const isLoading =
    menuStatus === "pending" ||
    modifiersStatus === "pending" ||
    itemOptionsStatus === "pending";

  useEffect(() => {
    if (menuStatus === "idle") {
      dispatch(fetchMenu());
    }
    if (modifiersStatus === "idle") {
      dispatch(fetchModifiers());
    }
    if (itemOptionsStatus === "idle") {
      dispatch(fetchItemOptions());
    }
  }, [dispatch, menuStatus, modifiersStatus, itemOptionsStatus]);

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
      />
      <UpsertSectionModal
        isOpen={showUpsertSectionModal}
        onClose={closeUpsertSectionModal}
      />
      <UpsertModifierDrawer
        isOpen={showUpsertModifierDrawer}
        onClose={closeUpsertModifierDrawer}
      />
      <UpsertItemOptionDrawer
        isOpen={showUpsertItemOptionDrawer}
        onClose={closeUpsertItemOptionDrawer}
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
          <StyledButton label="Add Section" onClick={openUpsertSectionModal} />
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
          <Section key={section.id} section={section} />
        ))}
      </Accordion>
    </PageLayout>
  );
}

export default Menu;

// const ProtectedPortal = withAuthenticationRequired(Menu);

// export default ProtectedPortal;
