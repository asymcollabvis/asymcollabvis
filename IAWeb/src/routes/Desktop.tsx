import { useEffect } from "react";
import { initConnection, leave } from "../common/client";
import { UserInfo } from "../common/message_pb";
import { useAppDispatch } from "../hooks";
import { setUser, setUserEnv, setUserId } from "../features/user/userSlice";
import React from "react";
import { AppBar, Toolbar, Typography, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import Minimap from "../desktop/Minimap";
import SidePanel from "../desktop/SidePanel";
import { GraphView } from "../desktop/GraphView";

export default function App() {
  console.log("rendering app");
  const dispatch = useAppDispatch();

  // const query = useQuery();
  // const dataset = query.get("dataset") ?? "0";
  // const roomId = query.get("roomId") ?? undefined;
  // const userId = query.get("userId") ?? undefined;
  let { roomId, userId, dataset } = useParams();
  dataset = dataset ?? "0";

  initConnection(UserInfo.ClientType.DESKTOP, dataset, roomId, userId).then(
    (res) => {
      dispatch(setUserEnv(UserInfo.ClientType.DESKTOP));
      dispatch(setUser(res));
      dispatch(setUserId(res.getId()));
    }
  );

  useEffect(() => {
    window.addEventListener("beforeunload", () => leave());
  }, []); // mounted

  useEffect(() => {
    document.title = `${roomId} ${userId}`;
  }, [roomId, userId]);

  return (
    <>
      <Grid container sx={{ height: "100%" }}>
        <Grid item xs={12}>
          <AppBar position="static" elevation={0}>
            <Toolbar variant="dense">
              <Typography variant="h6" component="div">
                Asymmetric Collaborative Visual Analytics
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={12}>
          <Grid container sx={{ height: "100%" }}>
            <Grid item xs={4}>
              <SidePanel />
            </Grid>
            <Grid item xs={8}>
              <GraphView />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* minimap */}
      {/* See the z-index to overlay all canvas html elements, referring to https://github.com/pmndrs/drei#html */}
      <Minimap></Minimap>
    </>
  );
}
