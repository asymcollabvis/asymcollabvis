import store from "../store";
import { useClient } from "./client";
import {
  Node,
  UserInfo,
  Link,
  InitialRequest,
  ClientActions,
  ServerNodesStatus,
  NodeList,
  EmptyMessage,
  NodeSpatialInfo,
  Position,
  SpatialInfo,
} from "./message_pb";

export function viewType(dim?: string) {
  if (dim === "2d") {
    return InitialRequest.ClientViewType.VIEW_2D;
  } else {
    return InitialRequest.ClientViewType.VIEW_3D;
  }
}

export function addNode(
  user: UserInfo,
  data: string,
  documentId: string,
  x?: number,
  y?: number,
  z?: number
) {
  console.log("addNode from", documentId);
  const client = useClient();
  let newNode = new Node();
  newNode.setRoomid(user.getRoomid() ?? "");
  newNode.setName(data);
  newNode.setData(data);
  newNode.setCreatedby(user.getId());
  newNode.setCreatedfrom(documentId);
  newNode.setUpdatedby(user.getId());
  if (x !== undefined || y !== undefined || z !== undefined) {
    let spatialInfo = new SpatialInfo();
    let position = new Position();
    if (x !== undefined) {
      position.setX(x);
    }
    if (y !== undefined) {
      position.setY(y);
    }
    if (z !== undefined) {
      position.setZ(z);
    }
    spatialInfo.setPosition(position);
    newNode.setSpatialinfo(spatialInfo);
  }
  client.addNode(newNode, {}, (err, res: Node) => {
    console.log(res.getName());
    newNode = res;
  });
}

export function emptyLink(user: UserInfo, linkId: string) {
  const client = useClient();
  let existingLink = store
    .getState()
    .graph.links.find((link) => link.id === linkId);
  if (existingLink && existingLink.id) {
    const newLink = new Link();
    newLink.setId(existingLink.id); // the server will deal with the remaining data fields like createdby...
    newLink.setData("");
    newLink.setUpdatedby(user.getId());
    client.addLink(newLink, {}, (err, res) => {
      console.log(res);
    });
  }
}

export function addLink(
  user: UserInfo,
  target: number,
  source: number,
  data: string,
  documentId: string
) {
  console.log("addLink", target, source, data);

  const client = useClient();
  const newLink = new Link();
  let existingLink = store
    .getState()
    .graph.links.find(
      (link) =>
        (link.target === target && link.source === source) ||
        (link.target === source && link.source === target)
    );
  if (existingLink && existingLink.id) {
    newLink.setId(existingLink.id);
  }
  newLink.setRoomid(user?.getRoomid() ?? "");
  newLink.setTarget(target);
  newLink.setSource(source);
  newLink.setData(data);
  newLink.setCreatedby(user.getId());
  newLink.setCreatedfrom(documentId);
  newLink.setUpdatedby(user.getId());
  client.addLink(newLink, {}, (err, res) => {
    console.log(res);
    clearNodeSelection(user.getId());
  });
}

export function deleteNode(user: UserInfo, id: number) {
  const client = useClient();
  // const targetNode = new Node();
  // targetNode.setRoomid(user.getRoomid() ?? "");
  // targetNode.setId(`${id}`);
  const targetNode = store
    .getState()
    .graph.nodesRaw.find((node) => +node.getId() === id);
  if (targetNode) {
    targetNode.setUpdatedby(user.getId());
    client.removeNode(targetNode, {}, (err, res) => {
      console.log(res);
    });
  }
}

export function deleteLink(user: UserInfo, id: number) {
  const client = useClient();
  const targetLink = new Link();
  targetLink.setRoomid(user.getRoomid() ?? "");
  targetLink.setId(`${id}`);
  targetLink.setUpdatedby(user.getId());
  client.removeLink(targetLink, {}, (err, res) => {
    console.log(res);
    clearNodeSelection(user.getId());
  });
}

export function sendAction(userId: string, id: number) {
  const clickedNodes = store.getState().graph.selectedNodeIds;
  const client = useClient();
  const targetNodeId = store.getState().graph.nodesRaw[id].getId();
  console.log("sendAction", targetNodeId, id);

  let action = new ClientActions();
  action.setUserid(userId);
  action.setRoomid(store.getState().user.userInfo.getRoomid());
  let newClickedNodes = [...clickedNodes];
  if (clickedNodes.includes(+targetNodeId)) {
    console.log("remove", targetNodeId);

    newClickedNodes.splice(clickedNodes.indexOf(+targetNodeId), 1);
  } else {
    console.log("add", targetNodeId);
    newClickedNodes.push(+targetNodeId);
  }
  action.setClickednodesList(newClickedNodes);
  client.updateNodesStatus(action, {}, (err, response: ServerNodesStatus) => {
    console.log(response);
  });
}

export function clearNodeSelection(userId: string) {
  const client = useClient();
  let action = new ClientActions();
  action.setUserid(userId);
  action.setRoomid(store.getState().user.userInfo.getRoomid());
  action.setClickednodesList([]);
  client.updateNodesStatus(action, {}, (err, response: ServerNodesStatus) => {
    console.log(response);
  });
}

export function mergeNodes(userId: string, roomId?: string, selectedNodesIds?: number[]) {
  if (!roomId) {
    console.error("no roomId");
    return;
  }

  const client = useClient();
  let nodeList = new NodeList();

  selectedNodesIds = selectedNodesIds ?? store.getState().graph.selectedNodeIds;

  selectedNodesIds.forEach((id) => {
    let info = new NodeSpatialInfo();
    info.setId(`${id}`);
    info.setRoomid(`${roomId}`);
    nodeList.addSpatialinfos(info);
    nodeList.setRoomid(roomId);
    nodeList.setUserid(userId);
  });

  client.mergeNodes(nodeList, {}, (err, response: EmptyMessage) => {
    // console.log(response);
  });
}

export function updateNode(user: UserInfo, data: string) {
  const client = useClient();
  const roomId = user.getRoomid();
  let targetNode = store
    .getState()
    .graph.nodesRaw.find(
      (n) => +n.getId() == store.getState().graph.selectedNodeIds[0]
    )
    ?.clone();

  if (targetNode) {
    targetNode.setData(data);
    targetNode.setRoomid(roomId);
    targetNode.setUpdatedby(user.getId());
    console.log("updateNode", targetNode.toObject());

    client.updateNode(targetNode, {}, (err, response: EmptyMessage) => {
      // console.log(response);
      clearNodeSelection(user.getId());
    });
  }
}

export function moveNode(
  user: UserInfo,
  id: string,
  position?: { x?: number; y?: number; z?: number }
) {
  position = position ?? store.getState().graph.toBeCreatedNodePosition;
  console.log("moveNode", id, position);

  if (!id) {
    return;
  }

  const client = useClient();
  const roomId = user.getRoomid();
  let targetNode = store
    .getState()
    .graph.nodesRaw.find((n) => n.getId() == id)
    ?.clone();

  console.log("moveNode", targetNode?.toObject(), position);

  if (targetNode) {
    let spatialInfo = new SpatialInfo();
    let pos = new Position();
    if (position.x) {
      pos.setX(position.x);
    }
    if (position.y) {
      pos.setY(position.y);
    }
    if (position.z) {
      pos.setZ(position.z);
    }

    spatialInfo.setPosition(pos);

    targetNode.setSpatialinfo(spatialInfo);

    targetNode.setRoomid(roomId);
    targetNode.setUpdatedby(user.getId());

    client.updateNode(targetNode, {}, (err, response: EmptyMessage) => {
      // console.log(response);
      clearNodeSelection(user.getId());
    });
  }
}

export function graphNodeUpdatePos(
  i,
  node,
  nodesRaw,
  instance,
  clickedNodes,
  temp,
  tempColor,
  colorArray
) {
  temp.position.set(node[0], node[1], node[2]);
  temp.quaternion.identity();

  if (nodesRaw[i] == undefined) {
    return;
  }

  if (nodesRaw[i].getName() === "document") {
    temp.scale.set(1.5, 1.5, 1.5);
  } else {
    temp.scale.set(1, 1, 1);
  }
  temp.updateMatrix();
  instance.setMatrixAt(i, temp.matrix);

  if (clickedNodes.includes(i)) {
    tempColor.set("red").toArray(colorArray, i * 3);
  } else {
    if (nodesRaw[i]) {
      tempColor
        .set(store.getState().room.color(nodesRaw[i].getCreatedby()))
        .toArray(colorArray, i * 3);
      if (nodesRaw[i].getName() === "document") {
        tempColor.set("black").toArray(colorArray, i * 3);
      }
    }
  }
}
