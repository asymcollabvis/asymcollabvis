import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import { Link, Outlet, Route } from "react-router-dom";
import { initConnection, useClient } from "../common/client";
import { InitialRequest, RequestById, UserInfo } from "../common/message_pb";
import useRoomStream from "../common/useRoomStream";
import { setUserEnv, setUser, setUserId } from "../features/user/userSlice";
import { useAppDispatch } from "../hooks";
import { ReplayControl } from "../replay/ReplayControl";
import ReplayPanel from "../replay/ReplayPanel";

export default function Replay() {
  const dispatch = useAppDispatch();
  initConnection(UserInfo.ClientType.DESKTOP, "", "replay", "replay").then(
    (res) => {
      dispatch(setUserEnv(UserInfo.ClientType.DESKTOP));
      dispatch(setUser(res));
      dispatch(setUserId(res.getId()));
    }
  );

  return (
    <Grid container>
      <Grid item xs={2}>
        <ReplayControl />
      </Grid>
      <Grid item xs={10}>
        <ReplayPanel />
      </Grid>
    </Grid>
  );
}
