import { useState } from "react";
import { useCounter, useMediaQuery } from "@mantine/hooks";
import { Button, em, Modal, Stack, Text } from "@mantine/core";

import ModifierSelect from "./ModifierSelect";

import type { MenuItemType, Modifier } from "../../helpers/menu";
import type { OrderItem } from "../../helpers/cart";
import IngredientsBadges from "./IngredientsBadges";

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItemType;
  onAddToOrder: (item: OrderItem) => void;
}

function MenuItemModal(props: MenuItemModalProps) {
  const { isOpen, onClose, menuItem, onAddToOrder } = props;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const [value, { increment, decrement, reset }] = useCounter(1, { min: 1 });

  const [selection, setSelection] = useState<OrderItem>({
    menuItem: menuItem,
    totalPrice: menuItem.price,
  });

  const onModalClose = () => {
    reset();
    onClose();
  };

  const selectModifier = (modifier: Modifier) => {
    setSelection((prevSelection) => ({
      ...prevSelection,
      modifiers: [...(prevSelection.modifiers || []), modifier],
      totalPrice: modifier.price
        ? prevSelection.totalPrice + modifier.price
        : prevSelection.totalPrice,
    }));
  };

  const onCheckboxChange = (modifier: Modifier, isChecked: boolean) => {
    if (isChecked) {
      selectModifier(modifier);
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

  return (
    <Modal
      fullScreen
      radius={0}
      opened={isOpen}
      onClose={onModalClose}
      title={menuItem.label.toUpperCase()}
      transitionProps={{ transition: "fade", duration: 200 }}
      styles={{
        header: { background: "cornsilk" },
        content: { background: "cornsilk" },
      }}
    >
      <Stack gap="sm" p={2} pt={7} pb={20} align="center">
        {menuItem.ingredients && (
          <IngredientsBadges ingredients={menuItem.ingredients} />
        )}

        {menuItem.modifiers && (
          <ModifierSelect
            label="Customise"
            allowMultipleSelections
            modifiers={menuItem.modifiers}
            onModifierSelect={(selectedModifier) => selectedModifier}
          />
        )}

        {menuItem.modifierCategories?.map((modifierCategory) => (
          <ModifierSelect
            key={modifierCategory.label}
            onModifierSelect={(selectedModifier) => selectedModifier}
            {...modifierCategory}
          />
        ))}

        <Button.Group>
          <Button color="dark" variant="light" radius="md" onClick={decrement}>
            -
          </Button>
          <Button.GroupSection color="dark" variant="light">
            {value}
          </Button.GroupSection>
          <Button color="dark" variant="light" radius="md" onClick={increment}>
            +
          </Button>
        </Button.Group>

        <Button
          px="lg"
          fullWidth
          color="red"
          variant="light"
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
    </Modal>
  );
}

export default MenuItemModal;
