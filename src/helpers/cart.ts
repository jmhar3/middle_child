import type { MenuItemType, Modifier } from "./menu";

export interface User {
  name: string;
  loyaltyPoints?: number;
}

export interface OrderItem {
  menuItem: MenuItemType;
  totalPrice: number;
  modifiers: Modifier[];
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
