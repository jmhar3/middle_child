import type { MenuItemType, Modifier, OrderItem } from "./state/types";

export const calculateOrderItemPrice = (
  menuItem: MenuItemType,
  modifiers?: Modifier[],
) => {
  if (modifiers) {
    const modifiersTotalPrice = modifiers?.reduce((accumulator, modifier) => {
      return modifier.price ? accumulator + modifier.price : accumulator;
    }, 0);
    return modifiersTotalPrice + menuItem.price;
  }
  return menuItem.price;
};

export const filterItemFromOrder = (
  existingItems: OrderItem[],
  filterItem: OrderItem,
) => existingItems.filter((existingItem) => existingItem !== filterItem);

export const getMinutesFromNow = (targetDate: Date) => {
  const now = Date.now(); // Current time in milliseconds
  const targetTime = targetDate.getTime(); // Target date in milliseconds

  const differenceInMilliseconds = targetTime - now;
  // 1000 milliseconds/second * 60 seconds/minute = 60000 milliseconds/minute
  const differenceInMinutes = differenceInMilliseconds / 60000;

  // Use Math.floor() or Math.ceil() depending on desired behavior, or leave as is for a precise value
  return differenceInMinutes;
};
