import { createAsyncThunk } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { supabase } from "../../supabase";
import { checkIsAuthenticated } from "../../helpers";

import type { SupabaseOrders, User } from "../types";

const formatSupaBaseOrders = (supabaseData: SupabaseOrders[]) => {
  return supabaseData.map(({ order_items, ...order }) => ({
    ...order,
    items: order_items.map(({ menu_item, order_items_modifiers, ...item }) => ({
      ...item,
      item: menu_item,
      modifiers: order_items_modifiers.map(({ modifiers }) => modifiers),
    })),
  }));
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const isAuthenticated = checkIsAuthenticated();
  const accessToken = localStorage.getItem("access_token");

  if (!isAuthenticated || !accessToken) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser(accessToken);

  if (!user) return null;

  const publicUser = await supabase
    .from("users")
    .select()
    .eq("id", user.id)
    .single();

  if (publicUser.error) {
    console.error(publicUser.error);
    notifications.show({
      withCloseButton: false,
      message: publicUser.error.message,
      title: publicUser.error.name,
      position: "bottom-right",
      color: "red",
    });
    throw Error(publicUser.error.message);
  }

  const userOrders = await supabase
    .from("orders")
    .select(
      `*,
      order_items (
        *, menu_item (*),
        order_items_modifiers(
          modifiers (*)
        )
      )`,
    )
    .eq("user", user.id)
    .order("due_at");

  if (userOrders.error) {
    console.error(userOrders.error);
    notifications.show({
      withCloseButton: false,
      message: userOrders.error.message,
      title: userOrders.error.name,
      position: "bottom-right",
      color: "red",
    });
    throw Error(userOrders.error.message);
  }

  return {
    ...publicUser.data,
    recent_items: formatSupaBaseOrders(userOrders.data).flatMap(
      (order) => order.items,
    ),
  };
});

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (user: Partial<User>) => {
    const { data, error } = await supabase
      .from("users")
      .update(user)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      notifications.show({
        withCloseButton: false,
        message: error.message,
        title: error.name,
        position: "bottom-right",
        color: "red",
      });
      console.error(error);
      throw Error(error.message);
    }

    return data;
  },
);

interface SignUpUserProps {
  email: string;
  password: string;
  name: string;
}

export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async ({ email, password, name }: SignUpUserProps) => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      notifications.show({
        withCloseButton: false,
        message: error.message,
        title: error.name,
        position: "bottom-right",
        color: "red",
      });
      console.error(error);
      throw Error(error.message);
    }
  },
);

export const signInUser = createAsyncThunk(
  "user/signInUser",
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      notifications.show({
        withCloseButton: false,
        message: error.message,
        title: error.name,
        position: "bottom-right",
        color: "red",
      });
      console.error(error);
      throw Error(error.message);
    }

    const futureDate = new Date();
    localStorage.setItem("access_token", data.session.access_token);
    localStorage.setItem(
      "jwt_expiry",
      futureDate
        .setSeconds(futureDate.getSeconds() + data.session.expires_in)
        .toString(),
    );
  },
);
