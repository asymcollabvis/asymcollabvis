import { Grid } from "@mui/material";
import React from "react";
import DocumentPanel from "./DocumentPanel";
import UserList from "./UserList";

export default function SidePanel() {
  return (
    <Grid container direction="column">
      <Grid item xs>
        <UserList></UserList>
      </Grid>
      {/* <Grid item xs>
                <RoomList></RoomList>
              </Grid> */}
      {/* <Grid item xs>
                <User></User>
              </Grid> */}
      {/* <Grid item xs>
                <ControlPanel></ControlPanel>
              </Grid> */}
      <DocumentPanel />
    </Grid>
  );
}
