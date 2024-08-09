import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IBaseUser } from "../../types/User";

const initialState: IBaseUser = {
  id: "",
  username: "",
  status: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IBaseUser>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.status = true;
    },
    clearUserData: (state) => {
      state.id = initialState.id;
      state.username = initialState.username;
      state.status = initialState.status;
    },
    setActivateUser: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
  },
});

export const { setUserData, clearUserData, setActivateUser } =
  userSlice.actions;
export default userSlice.reducer;
