import { createSlice } from "@reduxjs/toolkit";

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: { module: { value: false } },
  reducers: {
    setPermissions: (state, action) => {
      state.module = action.payload;
    },
  },
});

export const { setPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
