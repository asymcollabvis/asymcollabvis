import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardcastMessage, UserInfo } from "../../common/message_pb";
import { RootState } from "../../store";

export type GraphMode = "move" | "node" | "link";

// Define a type for the slice state
interface UserState {
  userInfo: UserInfo | null;
  userId: string | null;
  env: UserInfo.ClientType | null;
  boardcastMessage: BoardcastMessage.AsObject | null;
  graphMode: GraphMode;
  graphControl: any | null;
  nodesNearbyCursor: { nodeId: number; weight: number }[];
}

// Define the initial state using that type
const initialState: UserState = {
  userInfo: null,
  userId: null,
  env: null,
  boardcastMessage: null,
  graphMode: "node",
  graphControl: null,
  nodesNearbyCursor: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserInfo>) {
      console.log(state.userInfo);

      state.userInfo = action.payload;
    },
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
    setUserEnv(state, action: PayloadAction<UserInfo.ClientType>) {
      state.env = action.payload;
    },
    setBoardcastMessage(
      state,
      action: PayloadAction<BoardcastMessage.AsObject>
    ) {
      state.boardcastMessage = action.payload;
    },
    setGraphMode(state, action: PayloadAction<GraphMode>) {
      state.graphMode = action.payload;
    },
    setGraphControl(state, action: PayloadAction<any>) {
      state.graphControl = action.payload;
    },
    setNodesNearbyCursor(state, action: PayloadAction<{ nodeId: number; weight: number }[]>) {
      state.nodesNearbyCursor = action.payload;
    }
  },
});

export const {
  setUser,
  setUserId,
  setUserEnv,
  setBoardcastMessage,
  setGraphMode,
  setGraphControl,
  setNodesNearbyCursor
} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.userInfo;
export const selectUserId = (state: RootState) => state.user.userId;
export const selectUserEnv = (state: RootState) => state.user.env;
export const selectBoardcastMessage = (state: RootState) =>
  state.user.boardcastMessage;
export const selectGraphMode = (state: RootState) => state.user.graphMode;
export const selectGraphControl = (state: RootState) => state.user.graphControl;
export const selectNodesNearbyCursor = (state: RootState) => state.user.nodesNearbyCursor;

export default userSlice.reducer;
