import { sendUnaryData, ServerUnaryCall, ServerWritableStream } from "grpc";
import { getCache, saveCache } from "./cache/cache";
import { EventType } from "./common";
import { DocumentData, documents } from "./data/data";
import {
  addLinkToGraph,
  createGraph,
  createLinkForce,
  createStatus,
  getNodesSpatialInfo,
} from "./graph/graph";
import logger, { getLogsByIds, recoverFromLogs } from "./logger";
import { IEchoServiceServer } from "./message_grpc_pb.cjs";

import pkg from "./message_pb.cjs";
import { leave } from "./room";
import { clientTypeToString } from "./utils";
const {
  InitialRequest,
  EmptyMessage,
  InitialGraphData,
  Room,
  ServerNodesStatus,
  UserInfo,
  UserList,
  RoomList,
  Document,
  DocumentList,
  DocumentState,
  IdList,
  NodeList,
  LinkList,
  NodeSpatialInfo,
  HighlightedList,
  ReplayList,
  ReplayRecord,
  ReplayMessage,
  Link,
} = pkg;

// history state
let userDocumentHistory: { [userId: string]: string } = {};

// current state
let rooms: { [roomId: string]: pkg.Room } = {};
let users: { [roomId: string]: { [userId: string]: pkg.UserInfo } } = {};
let graphs: {
  [key: string]: {
    data: pkg.InitialGraphData;
    nodeSpatialInfos: pkg.NodeList;
    links: pkg.LinkList;
    status: pkg.ServerNodesStatus;
  };
} = {};
let layouts: {
  [key: string]: {
    "3D": any;
    "2D": any;
  };
} = {};
let roomDocumentStates: { [roomId: string]: pkg.DocumentState } = {};
let lastUserInfo: {
  [userId: string]: { userInfo: pkg.UserInfo; interval?: NodeJS.Timer };
} = {};

let streamUserCalls: ServerWritableStream<pkg.EmptyMessage, pkg.UserInfo>[] =
  [];
let streamRoomCalls: ServerWritableStream<pkg.EmptyMessage, pkg.Room>[] = [];
let streamDocumentCalls: ServerWritableStream<pkg.RequestById, pkg.Document>[] =
  [];
let streamRoomUserCalls: {
  [key: string]: ServerWritableStream<pkg.RequestById, pkg.UserInfo>[];
} = {};
let streamRoomDocumentCalls: {
  [key: string]: ServerWritableStream<pkg.RequestById, pkg.Document>[];
} = {};
let streamRoomGraphCalls: {
  [key: string]: ServerWritableStream<pkg.RequestById, pkg.GraphViewData>[];
} = {};
let streamRoomGraphStatusCalls: {
  [key: string]: ServerWritableStream<pkg.RequestById, pkg.ServerNodesStatus>[];
} = {};
let streamRoomNodesCalls: {
  [key: string]: {
    0: ServerWritableStream<pkg.InitialRequest, pkg.NodeList>[];
    1: ServerWritableStream<pkg.InitialRequest, pkg.NodeList>[];
  };
} = {};
let streamRoomBoardcastCalls: {
  [key: string]: ServerWritableStream<pkg.RequestById, pkg.BoardcastMessage>[];
} = {};

let roomList = new RoomList();
// let userList = new UserList();

let replayTimeout: { [key: string]: NodeJS.Timer } = {};
let allLogs = [];

export class EchoImpl implements IEchoServiceServer {
  getInitialGraphData(
    call: ServerUnaryCall<pkg.InitialRequest>,
    callback: sendUnaryData<pkg.InitialGraphData>
  ): void {
    // console.log("getInitialGraphData", call.request.getRequestedviewtype());
    // console.log(users[call.request.getUserid()]);
    // if (
    //   users[call.request.getUserid()] &&
    //   users[call.request.getUserid()].getRoomid()
    // ) {
    //   const initialGraphData =
    //     graphs[users[call.request.getUserid()].getRoomid()];
    //   const graphViewData = initialGraphData.data.getGraphviewdata();
    //   let layout;
    //   if (
    //     call.request.getRequestedviewtype() ===
    //     InitialRequest.ClientViewType.VIEW_3D
    //   ) {
    //     layout = layouts[users[call.request.getUserid()].getRoomid()]["3D"];
    //   } else if (
    //     call.request.getRequestedviewtype() ===
    //     InitialRequest.ClientViewType.VIEW_2D
    //   ) {
    //     layout = layouts[users[call.request.getUserid()].getRoomid()]["2D"];
    //   }
    //   updateGraph(
    //     layout,
    //     graphViewData!,
    //     createSpatialInfo([0, 0, 0], [0, 0, 0, 0], [1, 1, 1])
    //   );
    //   callback(null, initialGraphData.data);
    // } else {
    //   callback(null, new InitialGraphData());
    // }
  }
  getGraphData(call: ServerWritableStream<pkg.RequestById, pkg.GraphViewData>) {
    console.log("getGraphDataStream", call.request.getId());

    let roomId = call.request.getId();
    if (roomId) {
      const graph = graphs[roomId];
      call.write(graph.data.getGraphviewdata());

      let storedCall = streamRoomGraphCalls[roomId];
      if (!storedCall) {
        storedCall = [];
        streamRoomGraphCalls[roomId] = storedCall;
      }
      storedCall.push(call);
    } else {
      call.end();
    }
  }
  getNodes(call: ServerWritableStream<pkg.InitialRequest, pkg.NodeList>) {
    console.log("getNodesStream", call.request.getUserid());

    const roomId = call.request.getRoomid();
    const userId = call.request.getUserid();

    if (users[roomId][userId] && users[roomId][userId].getRoomid()) {
      const graph = graphs[roomId];
      let layout;
      let viewType = call.request.getRequestedviewtype();
      if (viewType === InitialRequest.ClientViewType.VIEW_3D) {
        layout = layouts[users[roomId][userId].getRoomid()]["3D"];
      } else if (viewType === InitialRequest.ClientViewType.VIEW_2D) {
        layout = layouts[users[roomId][userId].getRoomid()]["2D"];
      }

      // write graph data first because the graph might be stable and not ticked when call
      call.write(getNodesSpatialInfo(layout, graph.nodeSpatialInfos));
      // console.log(layout.nodes());

      let storedCall = streamRoomNodesCalls[roomId];
      if (!storedCall) {
        storedCall = { 0: [], 1: [] };
        streamRoomNodesCalls[roomId] = storedCall;
      }
      streamRoomNodesCalls[roomId][viewType].push(call);

      // update ontick function
      layout.on("tick", () => {
        streamRoomNodesCalls[roomId][viewType].forEach((_call) => {
          _call.write(getNodesSpatialInfo(layout, graph.nodeSpatialInfos));
        });
      });
    } else {
      call.end();
    }
  }
  getLinks(call: ServerWritableStream<pkg.RequestById, pkg.LinkList>) {
    // TODO: implement
    // however, we can get links using getGraphData
  }
  getNodesStatus(
    call: ServerWritableStream<pkg.RequestById, pkg.ServerNodesStatus>
  ) {
    console.log("getNodesStatusStream", call.request.getId());

    let roomId = call.request.getId();
    if (roomId) {
      const status = graphs[roomId].status;
      call.write(status);

      let storedCall = streamRoomGraphStatusCalls[roomId];
      if (!storedCall) {
        storedCall = [];
        streamRoomGraphStatusCalls[roomId] = storedCall;
      }
      storedCall.push(call);
    } else {
      call.end();
    }
  }
  updateNodesStatus(
    call: ServerUnaryCall<pkg.ClientActions>,
    callback: sendUnaryData<pkg.ServerNodesStatus>
  ) {
    const roomId = call.request.getRoomid();
    const userId = call.request.getUserid();
    if (roomId) {
      // const graph = graphs[roomId].data;
      const serverNodesStatus = graphs[roomId].status;
      let highlightedList = new HighlightedList();
      highlightedList.setHighlightedList(call.request.getClickednodesList());
      serverNodesStatus.getHightlightedMap().set(userId, highlightedList);

      streamRoomGraphStatusCalls[roomId].forEach((call) => {
        call.write(serverNodesStatus);
      });

      logger.info({
        event: EventType.UpdateNodesStatus,
        data: {
          ...serverNodesStatus.toObject(),
          userid: userId,
          roomid: roomId,
        },
      });

      callback(null, serverNodesStatus);
    } else {
      callback(null, new ServerNodesStatus());
    }
  }
  getAllUsers(call: ServerWritableStream<pkg.EmptyMessage, pkg.UserList>) {
    // userList.setUsersList(Object.values(users));
    // call.write(userList);
    // streamUserCalls.push(call);
  }
  getAllUsersByRoomId(
    call: ServerWritableStream<pkg.RequestById, pkg.UserList>
  ) {
    console.log("getAllUsersByRoomIdStream", call.request.getId());

    const roomId = call.request.getId();
    if (!roomId) {
      call.end();
      return;
    }

    const usersInRoom = rooms[roomId].getUsersList();
    // console.log(usersInRoom);
    let _userlist = new UserList();
    _userlist.setUsersList(usersInRoom);
    call.write(_userlist);
    streamRoomUserCalls[roomId].push(call);
  }
  getAllRooms(call: ServerWritableStream<pkg.EmptyMessage, pkg.RoomList>) {
    console.log("getAllRoomsStream");

    roomList.setRoomsList(Object.values(rooms));
    call.write(roomList);
    streamRoomCalls.push(call);
  }

  // everything start from join
  join(
    call: ServerUnaryCall<pkg.UserInfo>,
    callback: sendUnaryData<pkg.UserInfo>
  ) {
    const userInfo = call.request;

    let roomId = userInfo.getRoomid();
    const userId = userInfo.getId();

    if (!roomId) {
      roomId = "__noRoom__";
    }

    // create new room
    if (roomId) {
      if (roomId in rooms) {
        let oldUserInfo = rooms[roomId]
          .getUsersList()
          .find((user) => user.getId() === userId);
        if (oldUserInfo) {
          // leave the old user ID
          leave(
            roomId,
            rooms,
            oldUserInfo,
            streamRoomUserCalls,
            users,
            lastUserInfo
          );
        }
        rooms[roomId].addUsers(userInfo);
      } else {
        console.log("create new room");

        let newRoom = new Room();
        newRoom.setId(roomId);
        newRoom.addUsers(userInfo);
        rooms[roomId] = newRoom;
        roomList.setRoomsList(Object.values(rooms));
        users[roomId] = {};

        let newGraph = new InitialGraphData();
        let { graphViewData, nodes, links, layout, layout2D } = createGraph(
          getCache(roomId),
          roomId,
          documents[userInfo.getDataset()].length
        );
        newGraph.setGraphviewdata(graphViewData);
        // newGraph.setNodesstatus(createStatus());
        graphs[roomId] = {
          data: newGraph,
          nodeSpatialInfos: nodes,
          links: links,
          status: createStatus(),
        };
        layouts[roomId] = {
          "3D": layout,
          "2D": layout2D,
        };

        // update nodes
        graphs[roomId].data
          .getGraphviewdata()
          .getNodesList()
          .forEach((node) => {
            if (node.getName() === "document") {
              let docId = +node.getId() - 10000;
              node.setCreatedfrom(documents[userInfo.getDataset()][docId].file);
            }
          });

        // cache graph data
        setInterval(() => {
          // console.log("cached graph");
          saveCache(
            roomId,
            layouts[roomId]["3D"].nodes(),
            layouts[roomId]["3D"].force("link").links()
          );
        }, 15000);

        streamRoomCalls.forEach((call) => {
          call.write(roomList);
        });

        streamRoomUserCalls[roomId] = [];
      }
      if (streamRoomUserCalls[roomId]) {
        streamRoomUserCalls[roomId].forEach((call) => {
          let _userlist = new UserList();
          _userlist.setUsersList(rooms[roomId].getUsersList());
          call.write(_userlist);
        });
      } else {
        streamRoomUserCalls[roomId] = [];
        console.error("streamRoomUserCalls[roomId] is null");
      }
    }

    // create new user
    if (!users[roomId][userId]) {
      logger.info({
        event: EventType.Join,
        data: { ...userInfo.toObject(), userid: userId },
      });
      lastUserInfo[userId] = { userInfo: userInfo };
    }
    users[roomId][userId] = userInfo;
    // userList.setUsersList(Object.values(users));
    // streamUserCalls.forEach((call) => {
    //   call.write(userList);
    // });

    callback(null, userInfo);
  }
  leave(
    call: ServerUnaryCall<pkg.UserInfo>,
    callback: sendUnaryData<pkg.EmptyMessage>
  ) {
    const userInfo = call.request;
    const roomId = userInfo.getRoomid();
    const userId = userInfo.getId();

    if (roomId) {
      if (roomId in rooms) {
        let usersInRoom = rooms[roomId].getUsersList();

        rooms[roomId].setUsersList(
          usersInRoom.filter((user) => user.getId() != userInfo.getId())
        );

        // remove stream calls
        // streamRoomUserCalls = removeUserFromRoomStream(
        //   userId,
        //   roomId,
        //   streamRoomUserCalls
        // );
        // streamRoomGraphStatusCalls = removeUserFromRoomStream(
        //   userId,
        //   roomId,
        //   streamRoomGraphStatusCalls
        // );
        // streamRoomGraphCalls = removeUserFromRoomStream(
        //   userId,
        //   roomId,
        //   streamRoomGraphCalls
        // );
      }

      let streamRoomUserCall = streamRoomUserCalls[roomId];
      if (streamRoomUserCall) {
        streamRoomUserCall.forEach((call) => {
          let _userlist = new UserList();
          _userlist.setUsersList(rooms[roomId].getUsersList());
          call.write(_userlist);
        });
      }
    }
    if (roomId in users && userId in users[roomId])
      delete users[roomId][userId];
    else console.error("user not found");

    if (lastUserInfo[userId]) {
      clearInterval(lastUserInfo[userId].interval);
      lastUserInfo[userId] = { userInfo: userInfo };
    }
    // userList.setUsersList(Object.values(users));
    // streamUserCalls.forEach((call) => {
    //   call.write(userList);
    // });

    console.log(clientTypeToString(userInfo.getType()), userId, "left");
    console.log("remaining users", users[roomId] && Object.keys(users[roomId]));

    callback(null, new EmptyMessage());
  }
  addLink(
    call: ServerUnaryCall<pkg.Link>,
    callback: sendUnaryData<pkg.EmptyMessage>
  ) {
    const link = call.request;
    const roomId = link.getRoomid();
    const graphViewData = graphs[roomId].data.getGraphviewdata();
    console.log(link.toObject());

    if (link.getId()) {
      // update link
      const linkIndex = graphViewData
        .getLinksList()
        .findIndex((l) => l.getId() == link.getId());
      console.log("found link index", linkIndex);

      const linkList = graphViewData.getLinksList();
      if (linkIndex != -1) {
        console.log("update link");
        logger.info({
          event: EventType.UpdateLink,
          data: { ...link.toObject(), userid: link.getUpdatedby() },
        });

        linkList[linkIndex] = link;
        graphViewData.setLinksList(linkList);
      }
    } else {
      // reject if both source and target are documents
      let nodes = graphViewData.getNodesList();
      let sourceNode = nodes.find((n) => +n.getId() == link.getSource());
      let targetNode = nodes.find((n) => +n.getId() == link.getTarget());
      if (
        sourceNode.getName() == "document" &&
        targetNode.getName() == "document"
      ) {
        console.log("reject link");
        callback(null, new EmptyMessage().setIsrecieved(false));
        return;
      }

      addLinkToGraph(graphs, roomId, graphViewData, link);
    }

    const links = graphViewData.getLinksList();
    layouts[roomId]["3D"]
      .force("link", createLinkForce(links.map((l) => l.toObject())))
      .alpha(5)
      .restart();
    layouts[roomId]["2D"]
      .force("link", createLinkForce(links.map((l) => l.toObject())))
      .alpha(5)
      .restart();

    streamRoomGraphCalls[roomId].forEach((call) => {
      call.write(graphViewData);
    });
    callback(null, new EmptyMessage());
  }
  addNode(call: ServerUnaryCall<pkg.Node>, callback: sendUnaryData<pkg.Node>) {
    const node = call.request;
    const lastItem = graphs[node.getRoomid()].data
      .getGraphviewdata()
      .getNodesList()
      .at(-1);
    const nextId = lastItem ? +lastItem.getId() + 1 : 0;
    node.setId(`${nextId}`);
    logger.info({
      event: EventType.AddNode,
      data: { ...node.toObject(), userid: node.getUpdatedby() },
    });

    graphs[node.getRoomid()].data.getGraphviewdata().addNodes(node);
    graphs[node.getRoomid()].nodeSpatialInfos.addSpatialinfos(
      new NodeSpatialInfo().setId(node.getId()).setRoomid(node.getRoomid())
    );
    const graphNode: {
      id: number;
      data: string;
      name: string;
      createdBy: string;
      createdFrom: string;
      x?: number;
      y?: number;
      z?: number;
      vx?: number;
      vy?: number;
      vz?: number;
    } = {
      id: +node.getId(),
      data: node.getData(),
      name: node.getName(),
      createdBy: node.getCreatedby(),
      createdFrom: node.getCreatedfrom(),
    };
    let spatialInfo = node.getSpatialinfo();
    if (spatialInfo) {
      let position = spatialInfo.getPosition();

      let x = position.getX();
      let y = position.getY();
      let z = position.getZ();

      if (x != undefined) {
        graphNode.x = x;
        graphNode.vx = 0;
      }
      if (y != undefined) {
        graphNode.y = y;
        graphNode.vy = 0;
      }
      if (z != undefined) {
        graphNode.z = z;
        graphNode.vz = 0;
      } else {
        graphNode.z = 0;
        graphNode.vz = 0;
      }
    }
    // console.log("adding node", graphNode);

    // create document link
    let roomId = node.getRoomid();
    let graphViewData = graphs[roomId].data.getGraphviewdata();
    let targetLayouts = layouts[roomId];
    if (node.getCreatedfrom() !== "-1" || node.getCreatedfrom() !== undefined) {
      let user = users[roomId][node.getCreatedby()];
      let docNodeId =
        documents[user.getDataset()].findIndex(
          (doc) => doc.file == node.getCreatedfrom()
        ) + 10000;
      console.log("creating document link", docNodeId, node.getId());

      let link = new Link();
      link.setSource(+docNodeId);
      link.setTarget(+node.getId());
      link.setRoomid(roomId);
      link.setCreatedby(node.getCreatedby());
      link.setUpdatedby(node.getUpdatedby());
      link.setData("");
      link.setName("");
      addLinkToGraph(graphs, roomId, graphViewData, link);
    }

    targetLayouts["3D"]
      .nodes([...targetLayouts["3D"].nodes(), { ...graphNode }])
      .force(
        "link",
        createLinkForce(graphViewData.getLinksList().map((l) => l.toObject()))
      )
      .alpha(5)
      .restart();

    // generate 2D layout from 3D coordinates
    let newNodes = [...targetLayouts["2D"].nodes(), { ...graphNode }].map(
      (n, i) => {
        return {
          ...n,
          x: targetLayouts["2D"].nodes()[i]?.x ?? n.x,
          y: targetLayouts["2D"].nodes()[i]?.y ?? n.y,
        };
      }
    );

    // console.log("adding node 2D", newNodes);

    targetLayouts["2D"]
      .nodes(newNodes)
      .force(
        "link",
        createLinkForce(graphViewData.getLinksList().map((l) => l.toObject()))
      )
      .alpha(5)
      .restart();

    streamRoomGraphCalls[roomId].forEach((call) => {
      call.write(graphs[roomId].data.getGraphviewdata());
    });
    callback(null, node);
  }
  updateNode(
    call: ServerUnaryCall<pkg.Node>,
    callback: sendUnaryData<pkg.EmptyMessage>
  ) {
    const newNode = call.request;
    const roomId = newNode.getRoomid();
    console.log("updating node in room", roomId);

    // cannot update document node
    console.log("newNode", newNode.toObject());

    if (newNode.getName() == "document") {
      console.log("reject update document node");

      callback(null, new EmptyMessage().setIsrecieved(false));
      return;
    }

    // update graph data
    const graphViewData = graphs[newNode.getRoomid()].data.getGraphviewdata();
    const nodeList = graphViewData.getNodesList();

    const nodeIndex = nodeList.findIndex((n) => n.getId() === newNode.getId());

    // move the node if the spatial info is set
    let spatialInfo = newNode.getSpatialinfo();
    if (spatialInfo) {
      let position = spatialInfo.getPosition();

      // update layout node position
      let layout3D = layouts[roomId]["3D"];
      let layout2D = layouts[roomId]["2D"];

      let x = position.getX();
      let y = position.getY();
      let z = position.getZ();

      let targetNode3D = layout3D
        .nodes()
        .find((n) => n.id === +newNode.getId());

      if (!targetNode3D) {
        return;
      }

      if (x) {
        targetNode3D.x = x;
        targetNode3D.vx = 0;
      }
      if (y) {
        targetNode3D.y = y;
        targetNode3D.vy = 0;
      }
      if (z) {
        targetNode3D.z = z;
        targetNode3D.vz = 0;
      } else {
        // do not update z but reset the velocity
        targetNode3D.vz = 0;
      }

      let targetNode2D = layout2D
        .nodes()
        .find((n) => n.id === +newNode.getId());

      if (!targetNode2D) {
        return;
      }

      if (x) {
        targetNode2D.x = x;
        targetNode2D.vx = 0;
      }
      if (y) {
        targetNode2D.y = y;
        targetNode2D.vy = 0;
      }

      layout3D.alpha(5).restart();
      layout2D.alpha(5).restart();

      // reset spatial info
      newNode.setSpatialinfo(undefined);

      console.log("move node");
    }

    nodeList[nodeIndex] = newNode;

    graphViewData.setNodesList(nodeList);
    layouts[roomId]["3D"].nodes().find((n) => n.id === +newNode.getId()).data =
      newNode.getData();
    layouts[roomId]["2D"].nodes().find((n) => n.id === +newNode.getId()).name =
      newNode.getName();

    // update graph data to client first
    streamRoomGraphCalls[roomId].forEach((call) => {
      call.write(graphViewData);
    });
    logger.info({
      event: EventType.UpdateNode,
      data: { ...newNode.toObject(), userid: newNode.getUpdatedby() },
    });
    callback(null, new EmptyMessage());
  }
  mergeNodes(
    call: ServerUnaryCall<pkg.NodeList>,
    callback: sendUnaryData<pkg.EmptyMessage>
  ) {
    console.log("mergeNodes", call.request.toObject());

    const nodeList = call.request;
    const roomId = nodeList.getSpatialinfosList()[0].getRoomid();
    const graph = graphs[roomId].data;
    const nodeSpatialInfos = graphs[roomId].nodeSpatialInfos;
    const graphViewData = graph.getGraphviewdata();
    const allNodeIds = nodeList
      .getSpatialinfosList()
      .map((node) => +node.getId());

    // cannot merge document node
    for (let id of allNodeIds) {
      let node = graphViewData.getNodesList().find((n) => +n.getId() == id);
      if (node.getName() == "document") {
        console.log("reject merge document node");
        callback(null, new EmptyMessage().setIsrecieved(false));
        return;
      }
    }

    const mergedNodeId = +nodeList.getSpatialinfosList()[0].getId();
    const otherNodeIds = nodeList
      .getSpatialinfosList()
      .slice(1)
      .map((node) => +node.getId());

    let nodes = graphViewData.getNodesList();
    let links = graphViewData.getLinksList();
    // delete links between this node and all other to-be-merged node if any
    links = links.filter(
      (l) =>
        !(l.getSource() == mergedNodeId && allNodeIds.includes(l.getTarget()))
    );

    let layout2DNodes = layouts[roomId]["2D"].nodes();
    let layout3DNodes = layouts[roomId]["3D"].nodes();
    otherNodeIds.forEach((nodeId) => {
      const nodeIndex = nodes.findIndex((n) => +n.getId() == nodeId);
      if (nodeIndex == -1) {
        throw new Error("node not found");
      }
      // delete links between this node and all other to-be-merged node if any
      links = links.filter(
        (l) => !(l.getSource() == nodeId && allNodeIds.includes(l.getTarget()))
      );

      // transfer links
      links.forEach((l) => {
        if (l.getSource() == nodeId) {
          l.setSource(mergedNodeId);
        }
        if (l.getTarget() == nodeId) {
          l.setTarget(mergedNodeId);
        }
      });

      // delete old nodes
      nodes.splice(nodeIndex, 1);
      let spatialInfos = nodeSpatialInfos.getSpatialinfosList();
      spatialInfos.splice(nodeIndex, 1);
      nodeSpatialInfos.setSpatialinfosList(spatialInfos);
      layout2DNodes = layout2DNodes.filter((n) => +n.id != nodeId);
      layout3DNodes = layout3DNodes.filter((n) => +n.id != nodeId);
    });
    console.log(
      "mergeNodes",
      nodes.map((n) => n.toObject()),
      links.map((l) => l.toObject())
    );

    // console.log("layoutNodes", layout2DNodes, layout3DNodes);

    graphViewData.setNodesList(nodes);
    graphViewData.setLinksList(links);

    // update graph data to client first
    streamRoomGraphCalls[roomId].forEach((call) => {
      call.write(graphViewData);
    });

    // update layouts
    const layout2D = layouts[roomId]["2D"];
    const layout3D = layouts[roomId]["3D"];
    layout3D
      .nodes(layout3DNodes)
      .force("link", createLinkForce(links.map((l) => l.toObject())))
      .alpha(5)
      .restart();
    layout2D
      .nodes(layout2DNodes)
      .force("link", createLinkForce(links.map((l) => l.toObject())))
      .alpha(5)
      .restart();

    logger.info({ event: EventType.MergeNodes, data: nodeList.toObject() });

    callback(null, new EmptyMessage());
  }
  removeNode(
    call: ServerUnaryCall<pkg.Node>,
    callback: sendUnaryData<pkg.EmptyMessage>
  ) {
    const node = call.request;
    const graph = graphs[node.getRoomid()].data;
    const graphViewData = graph.getGraphviewdata();
    const nodeSpatialInfos = graphs[node.getRoomid()].nodeSpatialInfos;

    // cannot remove document node
    console.log("removeNode", node.toObject());

    if (node.getName() == "document") {
      console.log("cannot remove document node");

      callback(null, new EmptyMessage().setIsrecieved(false));
      return;
    }

    // update node list
    let nodes = graphViewData.getNodesList();
    const nodeId = node.getId();
    const nodeIndex = nodes.findIndex((n) => n.getId() == nodeId);
    if (nodeIndex == -1) {
      console.log("node not found");
      return;
    }
    let removedNode = nodes.splice(nodeIndex, 1);
    logger.info({
      event: EventType.RemoveNode,
      data: { ...node.toObject(), userid: node.getUpdatedby() },
    });
    graphViewData.setNodesList(nodes);

    // update node spatial info list
    let spatialInfos = nodeSpatialInfos.getSpatialinfosList();
    const spatialInfoIndex = spatialInfos.findIndex((n) => n.getId() == nodeId);
    if (spatialInfoIndex == -1) {
      console.log("ERROR: spatialInfoIndex not found", nodeId);
      return;
    }
    spatialInfos.splice(spatialInfoIndex, 1);
    nodeSpatialInfos.setSpatialinfosList(spatialInfos);

    // update link list
    let links = graphViewData.getLinksList();
    links = links.filter(
      (l) => l.getTarget() != +nodeId && l.getSource() != +nodeId
    );
    graphViewData.setLinksList(links);
    graph.setGraphviewdata(graphViewData);

    // update layouts
    const layout2D = layouts[node.getRoomid()]["2D"];
    const layout3D = layouts[node.getRoomid()]["3D"];
    layout3D
      .nodes(layout3D.nodes().filter((n) => n.id != nodeId))
      .force("link", createLinkForce(links.map((l) => l.toObject())))
      .alpha(5)
      .restart();
    layout2D
      .nodes(layout2D.nodes().filter((n) => n.id != nodeId))
      .force("link", createLinkForce(links.map((l) => l.toObject())))
      .alpha(5)
      .restart();

    console.log("removing node", node.getId());
    // console.log(layout3D.nodes());
    // console.log(
    //   graph
    //     .getGraphviewdata()
    //     .getNodesList()
    //     .map((n) => n.toObject())
    // );

    // update node status
    const nodeStatus = graphs[node.getRoomid()].status;
    let newStatus: { [key: string]: number[] } = {};
    nodeStatus.getHightlightedMap().forEach((value, key) => {
      newStatus[key] = value.getHighlightedList().filter((n) => n != +nodeId);
    });
    for (const key in newStatus) {
      const element = newStatus[key];

      nodeStatus
        .getHightlightedMap()
        .set(key, new HighlightedList().setHighlightedList(element));
    }

    streamRoomGraphStatusCalls[node.getRoomid()].forEach((call) => {
      call.write(nodeStatus);
    });

    streamRoomGraphCalls[node.getRoomid()].forEach((call) => {
      call.write(graphViewData);
    });
    callback(null, new EmptyMessage());
  }
  updateLink(
    call: ServerUnaryCall<pkg.Link>,
    callback: sendUnaryData<pkg.EmptyMessage>
  ) {
    // @deprecated (we don't use this anymore, we update link in addLink)
    // update link

    const newLink = call.request;
    const roomId = newLink.getRoomid();

    // update graph data
    const graphViewData = graphs[newLink.getRoomid()].data.getGraphviewdata();
    const linkList = graphViewData.getLinksList();

    const linkIndex = linkList.findIndex((n) => n.getId() === newLink.getId());
    linkList[linkIndex] = newLink;

    graphViewData.setLinksList(linkList);
    layouts[roomId]["3D"].force(
      "link",
      createLinkForce(linkList.map((l) => l.toObject()))
    );
    layouts[roomId]["2D"].force(
      "link",
      createLinkForce(linkList.map((l) => l.toObject()))
    );

    // update graph data to client first
    streamRoomGraphCalls[roomId].forEach((call) => {
      call.write(graphViewData);
    });

    callback(null, new EmptyMessage());
  }
  removeLink(
    call: ServerUnaryCall<pkg.Link>,
    callback: sendUnaryData<pkg.EmptyMessage>
  ) {
    const link = call.request;
    const graph = graphs[link.getRoomid()].data;
    const graphViewData = graph.getGraphviewdata();

    // update link list
    let links = graphViewData.getLinksList();
    const linkIndex = links.findIndex((l) => l.getId() == link.getId());
    if (linkIndex == -1) {
      console.log("link not found");
      return;
    }
    const removedLink = links.splice(linkIndex, 1);
    logger.info({
      event: EventType.RemoveLink,
      data: { ...link.toObject(), userid: link.getUpdatedby() },
    });
    graphViewData.setLinksList(links);
    graph.setGraphviewdata(graphViewData);

    // update layouts
    const layout2D = layouts[link.getRoomid()]["2D"];
    const layout3D = layouts[link.getRoomid()]["3D"];
    layout3D
      .force("link", createLinkForce(links.map((l) => l.toObject())))
      .alpha(5)
      .restart();
    layout2D
      .force("link", createLinkForce(links.map((l) => l.toObject())))
      .alpha(5)
      .restart();

    streamRoomGraphCalls[link.getRoomid()].forEach((call) => {
      call.write(graphs[link.getRoomid()].data.getGraphviewdata());
    });
    callback(null, new EmptyMessage());
  }
  getDocumentState(
    call: ServerWritableStream<pkg.RequestById, pkg.DocumentState>
  ) {
    console.log("getDocumentStateStream");

    const roomId = call.request.getId();

    // save the state and call for later use
    if (!streamRoomDocumentCalls[roomId]) {
      streamRoomDocumentCalls[roomId] = [];
    }
    streamRoomDocumentCalls[roomId].push(call);
    console.log(
      roomDocumentStates[roomId] && roomDocumentStates[roomId].toObject()
    );

    if (roomDocumentStates[roomId] == undefined) {
      const documentState = new DocumentState();
      roomDocumentStates[roomId] = documentState;
    }
    call.write(roomDocumentStates[roomId]);
  }
  getDoument(
    call: ServerUnaryCall<pkg.RequestById>,
    callback: sendUnaryData<pkg.Document>
  ) {
    const docId = call.request.getId();
    const userId = call.request.getUserid();
    const roomId = call.request.getRoomid();
    console.log(userId, "in", roomId, "getDocument", docId);

    const user = users[roomId][userId];

    const document = new Document();
    const doc: DocumentData = documents[user.getDataset()][docId];
    const { title, author, content, date, file } = doc;
    document.setId(docId);
    document.setTitle(title);
    if (author) {
      document.setAuthor(author);
    }
    document.setContent(content);
    document.setDate(date);
    document.setFilename(file);

    logger.info({
      event: EventType.GetDocument,
      data: { fileName: file, userid: userId, roomid: roomId, docid: docId },
    });

    callback(null, document);
  }
  updateDocumentState(
    call: ServerUnaryCall<pkg.RequestById>,
    callback: sendUnaryData<pkg.EmptyMessage>
  ) {
    const docId = call.request.getId();
    const userId = call.request.getUserid();
    const roomId = call.request.getRoomid();
    console.log(userId, "in", roomId, "updateDocument", docId);

    if (!users[roomId] || !users[roomId][userId]) return;

    const user = users[roomId][userId];
    user.setDocumentid(docId);

    if (roomId && roomDocumentStates[roomId]) {
      let state = roomDocumentStates[roomId].getDocumentstatesMap();

      // remove the user from the previous readBy list
      let prevDocumentId = userDocumentHistory[userId];
      if (prevDocumentId) {
        console.log(
          "removing user from previous readBy list",
          userId,
          prevDocumentId
        );

        let prevReadBy = state.get(prevDocumentId) ?? new IdList();
        prevReadBy.setIdsList(
          prevReadBy.getIdsList().filter((id) => id != userId)
        );
        state.set(prevDocumentId, prevReadBy);
      }
      userDocumentHistory[userId] = docId;

      let readBy = state.get(docId) ?? new IdList();
      readBy.addIds(userId);
      state.set(docId, readBy);
      streamRoomDocumentCalls[roomId].forEach((call) => {
        console.log(
          "writing document state",
          roomDocumentStates[roomId].toObject()
        );

        call.write(roomDocumentStates[roomId]);
      });
    }

    const doc: DocumentData = documents[user.getDataset()][docId];
    const { file } = doc;

    logger.info({
      event: EventType.GetDocument,
      data: { fileName: file, userid: userId, roomid: roomId, docid: docId },
    });

    callback(null, new EmptyMessage());
  }
  getAllDouments(
    call: ServerWritableStream<pkg.RequestById, pkg.DocumentList>
  ) {
    const userId = call.request.getId();
    const roomId = call.request.getRoomid();
    const user = users[roomId][userId];
    console.log(userId, roomId, "getAllDouments");

    let documentList = new DocumentList();
    documentList.setDocumentsList(
      documents[user.getDataset()].map((document, i) => {
        let doc = new Document();
        const { title, author, content, date, file } = document;
        doc.setId(`${i}`);
        doc.setTitle(title);
        if (author) {
          doc.setAuthor(author);
        }
        doc.setContent(content);
        doc.setDate(date);
        doc.setFilename(file);

        return doc;
      })
    );
    call.write(documentList);
    streamDocumentCalls.push(call);
  }
  updateUserStatus(
    call: ServerUnaryCall<pkg.UserInfo>,
    callback: sendUnaryData<pkg.EmptyMessage>
  ) {
    const userInfo = call.request;
    const userId = userInfo.getId();
    const roomId = userInfo.getRoomid();
    if (!users[roomId]) {
      callback(null, new EmptyMessage().setIsrecieved(false));
      return;
    }
    users[roomId][userId] = userInfo;
    // userList.setUsersList(Object.values(users));
    // streamUserCalls.forEach((call) => {
    //   call.write(userList);
    // });
    if (roomId && streamRoomUserCalls[roomId]) {
      streamRoomUserCalls[roomId].forEach((call) => {
        let _userlist = new UserList();
        // will not update the spatial information of the users in the room
        // instead we create a new list of user using the updated user list with the id in the users in the room
        _userlist.setUsersList(
          rooms[roomId].getUsersList().map((user) => {
            return users[roomId][user.getId()];
          })
        );
        call.write(_userlist);
      });

      if (lastUserInfo[userId]) {
        lastUserInfo[userId].userInfo = userInfo;
        if (!lastUserInfo[userId].interval) {
          console.log("starting interval for", userId);

          // log the userInfo every second
          logger.info({
            event: EventType.UserInfo,
            data: {
              ...lastUserInfo[userId].userInfo.toObject(),
              userid: lastUserInfo[userId].userInfo.getId(),
            },
          });
          lastUserInfo[userId].interval = setInterval(() => {
            // console.log("logging userInfo", userId);

            logger.info({
              event: EventType.UserInfo,
              data: {
                ...lastUserInfo[userId].userInfo.toObject(),
                userid: lastUserInfo[userId].userInfo.getId(),
              },
            });
          }, 100);
        }
      }
    }
    callback(null, new EmptyMessage());
  }
  sendBoardcastMessage(
    call: ServerUnaryCall<pkg.BoardcastMessage>,
    callback: sendUnaryData<pkg.EmptyMessage>
  ) {
    const boardcastMessage = call.request;
    const userId = boardcastMessage.getUserid();
    const roomId = boardcastMessage.getRoomid();

    if (roomId != undefined && streamRoomBoardcastCalls[roomId] != undefined) {
      streamRoomBoardcastCalls[roomId].forEach((_call) => {
        // boardcast to others only

        if (_call.request.getUserid() != userId) {
          console.log(
            "boardcasting",
            boardcastMessage.toObject(),
            "to",
            _call.request.getUserid()
          );
          _call.write(boardcastMessage);
        }
      });
    }

    logger.info({
      event: EventType.Highlight,
      data: boardcastMessage.toObject(),
    });
    callback(null, new EmptyMessage());
  }
  getBoardcastMessage(
    call: ServerWritableStream<pkg.RequestById, pkg.BoardcastMessage>
  ) {
    console.log("getBoardcastMessageStream");

    let roomId = call.request.getId();
    if (streamRoomBoardcastCalls[roomId] == undefined) {
      streamRoomBoardcastCalls[roomId] = [];
    }
    streamRoomBoardcastCalls[roomId].push(call);
  }
  getReplayList(
    call: ServerUnaryCall<pkg.RequestById>,
    callback: sendUnaryData<pkg.ReplayList>
  ) {
    // const userId = call.request.getId();
    // const roomId = users[userId].getRoomid();
    const replayList = new ReplayList();

    recoverFromLogs().then((logs) => {
      let pairs = new Set<string>();
      logs.forEach((log) => {
        if (log.data.userid && log.data.roomid) {
          pairs.add(`${log.data.userid},${log.data.roomid}`);
        } else if (!log.data.userid) {
          console.log("invalid log", log);
        }
      });

      pairs.forEach((pair) => {
        let replayRecord = new ReplayRecord();
        const _pair = pair.split(",");
        replayRecord.setUserid(_pair[0]);
        replayRecord.setRoomid(_pair[1]);
        replayList.addRecords(replayRecord);
      });
      callback(null, replayList);
    });
  }
  getReplay(call: ServerWritableStream<pkg.ReplayMessage, pkg.ReplayMessage>) {
    console.log("getReplayStream");

    const userId = call.request.getUserid();
    const roomId = call.request.getRoomid();
    const msg = call.request.getMsg();

    // start the replay
    if (msg == "start") {
      getLogsByIds(roomId, userId).then((logs) => {
        function execute(log) {
          const { event, data, timestamp } = log;
          switch (event) {
            case EventType.Join:
              break;
            case EventType.UpdateLink:
              break;
            case EventType.AddLink:
              console.log("add link at", timestamp, data);
              break;
            case EventType.AddNode:
              console.log("add node at", timestamp, data);
              break;

            case EventType.UpdateNode:
              break;
            case EventType.MergeNodes:
              break;
            case EventType.RemoveNode:
              break;
            case EventType.RemoveLink:
              break;
            case EventType.GetDocument:
              console.log("get document at", timestamp, data);
              break;

            default:
              break;
          }
        }

        function executeAll() {
          if (logs.length > 0) {
            // remove the first log and execute it
            let log = logs.shift();
            execute(log);
            // execute the next log
            if (logs.length > 0) {
              replayTimeout["replay"] = setTimeout(
                executeAll,
                logs[0].timestamp - log.timestamp
              );
            }
          }
        }

        // console.log("replaying", logs.length, "logs");
        // console.log(
        //   "time: ",
        //   convertMsToMinutesSeconds(
        //     logs[logs.length - 1].timestamp - logs[0].timestamp
        //   )
        // );

        // executeAll();

        logs.forEach((log) => {
          let replayMessage = new ReplayMessage();
          replayMessage.setUserid(userId);
          replayMessage.setRoomid(roomId);
          replayMessage.setMsg(JSON.stringify(log));
          call.write(replayMessage);
        });
        call.end();
      });
    }

    // for all streams, send the corresponding data to the user
    // streamRoomBoardcastCalls["replay"].forEach((_call) => {});

    // callback(null, new EmptyMessage());
  }
}
