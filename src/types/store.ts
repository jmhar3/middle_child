export interface Store {
  is_open: boolean;
  current_order_time: OrderTime;
  weekly_records: string;
}

export interface OrderTime {
  id: string;
  label: string;
  short: number;
  long: number;
}
