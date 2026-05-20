import { createSlice } from "@reduxjs/toolkit";

import {
  fetchUser,
  signInUser,
  signOutUser,
  signUpUser,
  updateUser,
} from "./userThunks";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { User } from "../types";

export interface UserState {
  data: User | null;
  status: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: UserState = {
  data: null,
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userUpdated(state, action: PayloadAction<User>) {
      state = { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(signUpUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(signUpUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(signUpUser.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(signInUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(signInUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(signInUser.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(signOutUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.data = null;
      })
      .addCase(signOutUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { userUpdated } = userSlice.actions;
export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user.data;

export const selectUserStatus = (state: RootState) => state.user.status;

export const selectUserRole = (state: RootState) => state.user.data?.is_admin;

export const selectUserLoyaltyPoints = (state: RootState) =>
  state.user.data?.loyalty_points;

export const selectRecentlyOrderedItems = (state: RootState) =>
  state.user.data?.recent_items;

export const selectUserOrders = (state: RootState) => state.user.data?.orders;
