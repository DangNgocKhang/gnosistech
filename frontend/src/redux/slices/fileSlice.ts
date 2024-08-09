import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IFile, IListFilesResponse } from "../../types/File";

const initialState: IFile = {
  folders: [],
  files: [],
  currentPathFile: [],
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setCurrentPath: (state, action: PayloadAction<string[]>) => {
      state.currentPathFile = action.payload;
    },
    setFoldersAndFiles: (state, action: PayloadAction<IListFilesResponse>) => {
      state.folders = action.payload.folders;
      state.files = action.payload.files;
    },
  },
});

export const { setCurrentPath, setFoldersAndFiles } = fileSlice.actions;
export default fileSlice.reducer;
