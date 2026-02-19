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

export const orderTimes: OrderTime[] = [
  {
    label: "A Little Busy",
    short: 5,
    long: 10,
  },
  {
    label: "Quite Busy",
    short: 10,
    long: 15,
  },
  {
    label: "Very Busy",
    short: 15,
    long: 20,
  },
];

export const store: Store = {
  isOpen: false,
  currentOrderTime: orderTimes[0],
};
