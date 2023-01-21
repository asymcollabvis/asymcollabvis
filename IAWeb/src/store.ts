import { configureStore } from "@reduxjs/toolkit";
import documentSlice from "./features/document/documentSlice";
import graphSlice from "./features/graph/graphSlice";
import replaySlice from "./features/replay/replaySlice";
import roomSlice from "./features/room/roomSlice";
import userSlice from "./features/user/userSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    graph: graphSlice,
    document: documentSlice,
    room: roomSlice,
    replay: replaySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
