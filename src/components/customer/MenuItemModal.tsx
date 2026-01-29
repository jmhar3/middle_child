import { useState } from "react";
import { Button, Modal, Stack } from "@mantine/core";

import type { MenuItemType, Modifier } from "../../helpers/menu";
import type { OrderItem } from "../../helpers/cart";

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItemType;
  onAddToOrder: (item: OrderItem) => void;
}

function MenuItemModal(props: MenuItemModalProps) {
  const { isOpen, onClose, menuItem, onAddToOrder } = props;

  const [selection, setSelection] = useState<OrderItem>({
    menuItem: menuItem,
    totalPrice: menuItem.price,
  });

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
      opened={isOpen}
      onClose={onClose}
      title={menuItem.label.toUpperCase()}
    >
      <Stack>
        <Stack gap={1} p={2} pt={7} pb={20}>
          {/*{menuItem.modifiers && (
            <FormControl>
              <FormLabel>Customise</FormLabel>
              <FormGroup>
                <Stack>
                  {menuItem.modifiers.map((modifier) => (
                    <FormControlLabel
                      key={modifier.label + menuItem.label}
                      sx={{ justify: "space-between" }}
                      labelPlacement="start"
                      control={
                        <Checkbox
                          onChange={(_event, isChecked) =>
                            onCheckboxChange(modifier, isChecked)
                          }
                        />
                      }
                      label={modifier.label}
                    />
                  ))}
                </Stack>
              </FormGroup>
            </FormControl>
          )}

          {menuItem.modifierCategories?.map((modifierCategory) => (
            <FormControl key={modifierCategory.label + menuItem.label}>
              <FormLabel id={modifierCategory.label}>
                {modifierCategory.label}
              </FormLabel>

              {modifierCategory.allowMultipleSelections ? (
                <FormGroup>
                  <Stack>
                    {modifierCategory.modifiers.map((modifier) => (
                      <FormControlLabel
                        key={
                          modifier.label +
                          modifierCategory.label +
                          menuItem.label
                        }
                        sx={{ justifyContent: "space-between" }}
                        labelPlacement="start"
                        control={<Checkbox />}
                        label={modifier.label}
                      />
                    ))}
                  </Stack>
                </FormGroup>
              ) : (
                <RadioGroup
                  row
                  aria-labelledby={modifierCategory.label}
                  name={modifierCategory.label}
                >
                  <Stack width="100%">
                    {modifierCategory.modifiers.map((modifier) => (
                      <FormControlLabel
                        key={
                          modifier.label +
                          modifierCategory.label +
                          menuItem.label
                        }
                        defaultChecked={
                          modifier.id === modifierCategory.defaultSelected
                        }
                        sx={{ justifyContent: "space-between" }}
                        labelPlacement="start"
                        value={modifier.label}
                        control={<Radio />}
                        label={modifier.label}
                      />
                    ))}
                  </Stack>
                </RadioGroup>
              )}
            </FormControl>
          ))}*/}

          <Button variant="contained" onClick={() => onAddToOrder(selection)}>
            Add to order
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}

export default MenuItemModal;
