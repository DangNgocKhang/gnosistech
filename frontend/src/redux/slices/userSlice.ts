import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IBaseUser } from "../../types/User";

// interface Props {
//   propertyCodeSelected: string[];
//   propertyAttributeSelected: string;
//   isShowChart: boolean;
// }

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
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
