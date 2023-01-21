import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardcastMessage, UserInfo } from "../../common/message_pb";
import { RootState } from "../../store";

// Define a type for the slice state
interface ReplayState {
  replayData?: {}[];
  list?: [];
  selectedList?: string[];
}

// Define the initial state using that type
const initialState: ReplayState = {};

export const userSlice = createSlice({
  name: "replay",
  initialState,
  reducers: {
    setReplayData(state, action: PayloadAction<{}[]>) {
      state.replayData = action.payload;
    },
    setList(state, action: PayloadAction<[]>) {
      state.list = action.payload;
    },
    setSelectedList(state, action: PayloadAction<string[]>) {
      state.selectedList = action.payload;
    }
  },
});

export const { setReplayData, setList, setSelectedList } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectReplayData = (state: RootState) => state.replay.replayData;
export const selectList = (state: RootState) => state.replay.list;
export const selectSelectedList = (state: RootState) => state.replay.selectedList;

export default userSlice.reducer;
