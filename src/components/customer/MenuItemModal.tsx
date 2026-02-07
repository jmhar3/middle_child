import { useMemo, useState } from "react";
import { useCounter, useMediaQuery } from "@mantine/hooks";
import { Box, Button, em, Modal, Stack } from "@mantine/core";

import IngredientsBadges from "./IngredientsBadges";
import ModifierCheckbox from "./ModifierCheckbox";
import ModifierRadio from "./ModifierRadio";

import type { MenuItemType, Modifier } from "../../helpers/menu";
import { calculateOrderItemPrice, type OrderItem } from "../../helpers/cart";
import ButtonWithPrice from "./ButtonWithPrice";
import NoteInput from "./NoteInput";

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItemType;
  onAddToOrder: (item: OrderItem) => void;
  orderItem?: OrderItem;
}

function MenuItemModal(props: MenuItemModalProps) {
  const {
    isOpen,
    onClose,
    menuItem,
    onAddToOrder,
    orderItem = {
      menuItem: menuItem,
      totalPrice: menuItem.price,
      modifiers: [],
    },
  } = props;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [quantity, { increment, decrement, reset }] = useCounter(1, { min: 1 });

  const [note, setNote] = useState<string | undefined>();
  const [selection, setSelection] = useState<OrderItem>(orderItem);

  const onModalClose = () => {
    reset();
    onClose();
  };

  const onModifierSelect = (modifier: Modifier, isSelected: boolean) => {
    if (isSelected) {
      setSelection((prevSelection) => ({
        ...prevSelection,
        modifiers: [...(prevSelection.modifiers || []), modifier],
      }));
    } else {
      setSelection((prevSelection) => ({
        ...prevSelection,
        modifiers: prevSelection.modifiers?.filter((m) => m.id !== modifier.id),
      }));
    }
  };

  const filterSelectedModifiers = (modifierOptions: Modifier[]) =>
    selection.modifiers.filter((selectedModifier) =>
      modifierOptions.includes(selectedModifier),
    );

  const menuItemPrice = useMemo(
    () => calculateOrderItemPrice(selection.menuItem, selection.modifiers),
    [selection],
  );

  return (
    <Modal
      fullScreen
      radius={0}
      opened={isOpen}
      onClose={onModalClose}
      title={menuItem.label.toUpperCase()}
      transitionProps={{ transition: "fade", duration: 200 }}
      styles={{
        header: { background: "whitesmoke" },
        content: { background: "whitesmoke" },
      }}
    >
      <Stack pb={60} align="center">
        {menuItem.ingredients && (
          <IngredientsBadges ingredients={menuItem.ingredients} />
        )}

        {menuItem.modifiers && (
          <ModifierCheckbox
            modifiers={menuItem.modifiers}
            selectedModifiers={filterSelectedModifiers(menuItem.modifiers)}
            onModifierSelect={onModifierSelect}
          />
        )}

        {menuItem.modifierCategories?.map((modifierCategory) =>
          modifierCategory.allowMultipleSelections ? (
            <ModifierCheckbox
              key={modifierCategory.label}
              selectedModifiers={filterSelectedModifiers(
                modifierCategory.modifiers,
              )}
              onModifierSelect={onModifierSelect}
              {...modifierCategory}
            />
          ) : (
            <ModifierRadio
              key={modifierCategory.label}
              selectedModifiers={filterSelectedModifiers(
                modifierCategory.modifiers,
              )}
              onModifierSelect={onModifierSelect}
              {...modifierCategory}
            />
          ),
        )}

        <NoteInput label="Notes" note={note} setNote={setNote} />

        <Button.Group w="100%" pt="3">
          <Button
            fullWidth
            radius="sm"
            variant="filled"
            color="darkslategray"
            onClick={decrement}
          >
            -
          </Button>
          <Button.GroupSection
            w="100%"
            bg="white"
            color="darkslategray"
            variant="outline"
          >
            {quantity}
          </Button.GroupSection>
          <Button
            fullWidth
            radius="sm"
            variant="filled"
            color="darkslategray"
            onClick={increment}
          >
            +
          </Button>
        </Button.Group>

        <Box
          w="100%"
          pos="fixed"
          bottom="0"
          px={isMobile ? "md" : "lg"}
          pb={isMobile ? "md" : "lg"}
        >
          <ButtonWithPrice
            label="Add to order"
            price={menuItemPrice * quantity}
            onClick={() => {
              for (let i = 0; i < quantity; i++) {
                onAddToOrder(selection);
              }
              onModalClose();
            }}
          />
        </Box>
      </Stack>
    </Modal>
  );
}

export default MenuItemModal;
