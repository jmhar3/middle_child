import dayjs from "dayjs";
import { menu } from "./menu";
import type { MenuItemType, Modifier } from "./menu";

export interface User {
  id: string;
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

export interface OrderType {
  id: string;
  user: User;
  dueAt: dayjs.Dayjs;
  total: number;
  notes?: string;
  items: OrderItem[];
  isAccepted?: boolean;
  isComplete: boolean;
  isReadyToCollect: boolean;
  cancellationMessage?: string;
}

export const mockOrders: OrderType[] = [
  {
    id: "1",
    user: { id: "1", name: "Jess", loyaltyPoints: 3 },
    dueAt: dayjs().subtract(2, "minutes"),
    total: 15,
    notes: "Chuck em in a carry tray pls",
    items: [
      {
        menuItem: menu[0].items[0],
        modifiers: [{ id: "2", label: "BYO Keep Cup" }],
        quantity: 2,
        note: "Extra honey pls :)",
      },
      {
        menuItem: menu[0].items[2],
        modifiers: [],
        quantity: 1,
      },
      {
        menuItem: menu[0].items[4],
        modifiers: [],
        quantity: 1,
      },
    ],
    isComplete: false,
    isReadyToCollect: false,
  },
  {
    id: "2",
    user: { id: "2", name: "Noah", loyaltyPoints: 5 },
    dueAt: dayjs().add(6, "minutes"),
    total: 6.5,
    items: [
      {
        menuItem: menu[0].items[2],
        modifiers: [],
        quantity: 1,
      },
      {
        menuItem: menu[0].items[5],
        modifiers: [],
        quantity: 1,
      },
    ],
    isComplete: false,
    isReadyToCollect: false,
  },
  {
    id: "3",
    user: { id: "3", name: "Sam", loyaltyPoints: 4 },
    dueAt: dayjs().add(9, "minutes"),
    total: 12,
    items: [
      {
        menuItem: menu[0].items[3],
        modifiers: [{ id: "2", label: "BYO Keep Cup" }],
        quantity: 1,
      },
      {
        menuItem: menu[1].items[1],
        modifiers: [],
        quantity: 1,
      },
    ],
    isComplete: false,
    isReadyToCollect: false,
  },
];

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
