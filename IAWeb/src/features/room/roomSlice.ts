import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Frustum,
  Room,
  SpatialInfo,
  UserInfo,
  UserList,
} from "../../common/message_pb";
import { RootState } from "../../store";
import * as d3 from "d3";

// Define a type for the slice state
interface RoomState {
  room: Room | null;
  userList: UserInfo[];
  color: d3.ScaleOrdinal<string, string, never>;
  userSpatialInfo: { [key: string]: SpatialInfo };
  userFrustum: { [key: string]: Frustum | undefined };
  nearCursorNodes: {
    [userId: string]: {
      nodeId: number;
      weight: number;
    }[];
  };
}

const color = d3.scaleOrdinal(d3.schemeAccent);

// Define the initial state using that type
const initialState: RoomState = {
  room: null,
  userList: [],
  color,
  userSpatialInfo: {},
  userFrustum: {},
  nearCursorNodes: {},
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom(state, action: PayloadAction<Room>) {
      state.room = action.payload;
    },
    setUserList(state, action: PayloadAction<UserInfo[]>) {
      state.userList = action.payload;
      color.domain(action.payload.map((u) => u.getId()));
    },
    setUserSpatialInfo(
      state,
      action: PayloadAction<{
        id: string;
        spatialInfo: SpatialInfo;
        frustum?: Frustum;
      }>
    ) {
      const { id, spatialInfo, frustum } = action.payload;
      state.userSpatialInfo[id] = spatialInfo;
      state.userFrustum[id] = frustum;
    },
    setNearCursorNodes(
      state,
      action: PayloadAction<{ userId: string; nodes: {nodeId: number; weight: number}[] }>
    ) {
      const { userId, nodes } = action.payload;
      state.nearCursorNodes[userId] = nodes;
    },
  },
});

export const { setRoom, setUserList, setUserSpatialInfo, setNearCursorNodes } =
  roomSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectRoom = (state: RootState) => state.room.room;
export const selectUserList = (state: RootState) => state.room.userList;
export const selectNearCursorNodes = (state: RootState) =>
  state.room.nearCursorNodes;

export default roomSlice.reducer;
