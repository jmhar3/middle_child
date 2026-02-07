import type { MenuItemType, Modifier } from "./menu";

export interface User {
  name: string;
  loyaltyPoints?: number;
}

export interface OrderItem {
  menuItem: MenuItemType;
  modifiers: Modifier[];
  quantity: number;
  note?: string;
}

export interface Cart {
  items: OrderItem[];
  total: number;
  pickUpTimeFromNow: number;
  notes?: string;
}

export interface Order {
  user: User;
  items: OrderItem[];
  total: number;
  dueAt: Date;
  notes?: string;
  isAccepted?: boolean;
  isReadyToCollect: boolean;
  isCollected: boolean;
}

export const calculateOrderItemPrice = (
  menuItem: MenuItemType,
  modifiers: Modifier[],
) => {
  const modifiersTotalPrice = modifiers.reduce((accumulator, modifier) => {
    return modifier.price ? accumulator + modifier.price : accumulator;
  }, 0);
  return modifiersTotalPrice + menuItem.price;
};

export const findExistingOrderItem = (
  existingOrder: OrderItem[],
  newOrderItem: OrderItem,
) => {
  return existingOrder.find(
    (existingItem) =>
      existingItem.menuItem.id === newOrderItem.menuItem.id &&
      JSON.stringify(existingItem.modifiers) ===
        JSON.stringify(newOrderItem.modifiers) &&
      existingItem.note === newOrderItem.note,
  );
};

export const filterItemFromOrder = (
  existingItems: OrderItem[],
  filterItem: OrderItem,
) =>
  existingItems.filter(
    (existingItem) =>
      existingItem.menuItem.id !== filterItem.menuItem.id &&
      JSON.stringify(existingItem.modifiers) !==
        JSON.stringify(filterItem.modifiers) &&
      existingItem.note !== filterItem.note,
  );
