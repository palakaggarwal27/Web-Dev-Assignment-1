import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "null",
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUser: (state,action) => {
      state.value = action.payload;
      console.log(state.value);
    }
  },
});

export const { setUser } = counterSlice.actions;
export default counterSlice.reducer;
