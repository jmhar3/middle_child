import { useState } from "react";
import { useCounter, useMediaQuery } from "@mantine/hooks";
import { Button, em, Modal, Stack, Text } from "@mantine/core";

import IngredientsBadges from "./IngredientsBadges";
import ModifierCheckbox from "./ModifierCheckbox";
import ModifierRadio from "./ModifierRadio";

import type { MenuItemType, Modifier } from "../../helpers/menu";
import type { OrderItem } from "../../helpers/cart";

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

  const [value, { increment, decrement, reset }] = useCounter(1, { min: 1 });

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
        totalPrice: modifier.price
          ? prevSelection.totalPrice + modifier.price
          : prevSelection.totalPrice,
      }));
    } else {
      setSelection((prevSelection) => ({
        ...prevSelection,
        modifiers: prevSelection.modifiers?.filter((m) => m.id !== modifier.id),
        totalPrice: modifier.price
          ? prevSelection.totalPrice - modifier.price
          : prevSelection.totalPrice,
      }));
    }
  };

  const filterSelectedModifiers = (modifierOptions: Modifier[]) =>
    selection.modifiers.filter((selectedModifier) =>
      modifierOptions.includes(selectedModifier),
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
      <Stack gap="sm" p={2} pt={7} pb={120} align="center">
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

        <Stack
          px="lg"
          w="100%"
          align="center"
          pos="fixed"
          bottom={isMobile ? "20px" : "11px"}
        >
          <Button.Group>
            <Button
              radius="md"
              variant="filled"
              color="darkslategray"
              onClick={decrement}
            >
              -
            </Button>
            <Button.GroupSection
              bg="whitesmoke"
              color="darkslategray"
              variant="outline"
            >
              {value}
            </Button.GroupSection>
            <Button
              radius="md"
              variant="filled"
              color="darkslategray"
              onClick={increment}
            >
              +
            </Button>
          </Button.Group>

          <Button
            fullWidth
            variant="filled"
            color="darkslategray"
            justify="space-between"
            size={isMobile ? "md" : "lg"}
            rightSection={<Text fw={700}>${selection.totalPrice}</Text>}
            onClick={() => {
              onAddToOrder(selection);
              onModalClose();
            }}
          >
            Add to order
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}

export default MenuItemModal;
