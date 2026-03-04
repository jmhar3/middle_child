import { notifications } from "@mantine/notifications";
import { supabase } from "./supabase";

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

export const orderTimes: OrderTime[] = [
  {
    id: "1",
    label: "A Little Busy",
    short: 5,
    long: 10,
  },
  {
    id: "2",
    label: "Quite Busy",
    short: 10,
    long: 15,
  },
  {
    id: "3",
    label: "Very Busy",
    short: 15,
    long: 20,
  },
];

export const store: Store = {
  is_open: true,
  current_order_time: orderTimes[0],
  weekly_records: JSON.stringify({}),
};

export const fetchStoreData = async () => {
  const { data, error } = await supabase
    .from("store_info")
    .select(
      "is_open, current_order_time (id, label, short, long), weekly_records",
    )
    .eq("id", "bb1749fd-91a9-4fc4-bd22-7b9ced12c0d9")
    .overrideTypes<Array<Store>, { merge: false }>();

  if (data) {
    return data[0];
  }

  if (error) {
    notifications.show({
      withCloseButton: false,
      message: error.message,
      title: error.name,
      position: "bottom-right",
      color: "red",
    });
    console.error(error);
  }
};

interface UpdateStoreDataParams {
  is_open?: boolean;
  current_order_time?: string;
}

export const updateStoreData = async ({
  is_open,
  current_order_time,
}: UpdateStoreDataParams) => {
  const { error } = await supabase
    .from("store_info")
    .update({ is_open: is_open, current_order_time: current_order_time })
    .eq("id", "bb1749fd-91a9-4fc4-bd22-7b9ced12c0d9");

  if (error) {
    notifications.show({
      withCloseButton: false,
      message: error.message,
      title: error.name,
      position: "bottom-right",
      color: "red",
    });
    console.error(error);
  }
};

export const fetchOrderTimes = async () => {
  const { data, error } = await supabase.from("order_times").select();

  if (data) {
    return data;
  }

  if (error) {
    notifications.show({
      withCloseButton: false,
      message: error.message,
      title: error.name,
      position: "bottom-right",
      color: "red",
    });
    console.error(error);
  }
};
