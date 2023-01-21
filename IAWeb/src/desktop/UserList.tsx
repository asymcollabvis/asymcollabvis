import { useEffect, useState } from "react";
import { useClient } from "../common/client";
import { UserInfo, EmptyMessage, UserList } from "../common/message_pb";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import React from "react";
import { useAppSelector } from "../hooks";
import { selectUserList } from "../features/room/roomSlice";
import store from "../store";
import { selectUser } from "../features/user/userSlice";
import { Grid } from "@mui/material";

export default function UserDisplayList() {
  const selector = useAppSelector;
  const users = selector(selectUserList);
  const user = selector(selectUser);

  return (
    <Grid container item direction="row">
      <Grid item xs={4}>
        <Box
          component="div"
          sx={{ width: "100%", bgcolor: "background.paper" }}
        >
          <List dense>
            {users &&
              users.map((_user, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={`${_user.getId()}${user?.getId() == _user.getId() ? " (you)" : ""
                      }`}
                    sx={{
                      backgroundColor: store
                        .getState()
                        .room.color(_user.getId()),
                    }}
                  />
                </ListItem>
              ))}
          </List>
        </Box>
      </Grid>
      <Grid item xs={8}>
        Task: You have been asked to pursue a line of investigation into ONE unexpected illegal activity against wildlife. Explore and figure out whos, whats, wheres, whens, whys, and hows.
      </Grid>
    </Grid>
  );
}
