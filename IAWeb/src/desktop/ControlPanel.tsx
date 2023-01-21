import { Button, Card, Stack } from "@mui/material";
import React from "react";
import { useClient } from "../common/client";
import { Node, Link } from "../common/message_pb";
import { selectUser } from "../features/user/userSlice";
import { useAppSelector } from "../hooks";

export default function ControlPanel() {
  const selector = useAppSelector;
  const user = selector(selectUser);

  function addNode() {
    console.log("addNode");
    const client = useClient();
    let newNode = new Node();
    newNode.setRoomid(user?.getRoomid() ?? "");
    client.addNode(newNode, {}, (err, res: Node) => {
      console.log(res.getName());
      newNode = res;

      const newLink = new Link();
      newLink.setRoomid(user?.getRoomid() ?? "");
      newLink.setTarget(1);
      newLink.setSource(+newNode.getName());
      client.addLink(newLink, {}, (err, res) => {
        console.log(res);
      });
    });
  }

  return (
    <Card>
      <Stack spacing={2}>
        <Button variant="contained" onClick={addNode}>
          Add node
        </Button>
      </Stack>
    </Card>
  );
}
