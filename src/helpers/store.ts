export interface Store {
  isOpen: boolean;
  currentOrderTime: OrderTime;
  weeklyRecords?: JSON;
}

export interface OrderTime {
  label: string;
  short: number;
  long: number;
}

export const store: Store = {
  isOpen: false,
  currentOrderTime: { label: "A Little Busy", short: 5, long: 10 },
};
