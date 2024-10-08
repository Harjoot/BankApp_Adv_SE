// src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;

// Selector to access userData
export const selectUserData = (state) => state.user.userData;

export default userSlice.reducer;
