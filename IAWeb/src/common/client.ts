import store from "../store";
import {
  computeGraphSpatialInfo,
  computeUserFrustum,
  computeUserSpatialInfo,
} from "./awareness";
import { EchoServiceClient } from "./message_grpc_web_pb";
import {
  BoardcastMessage,
  DocumentState,
  InitialRequest,
  RequestById,
  UserInfo,
  UserList,
} from "./message_pb";
import * as THREE from "three";

let client: EchoServiceClient, userInfo: UserInfo;
function initConnection(
  type: UserInfo.ClientType,
  dataset: string,
  roomId?: string,
  userId?: string
) {
  console.log("init connection");

  // client = new EchoServiceClient("https://172.30.59.33:8081");
  // client = new EchoServiceClient("https://192.168.1.250:8081");
  // client = new EchoServiceClient("https://128.173.239.204:8081");
  // client = new EchoServiceClient("https://localhost:8081");
  // client = new EchoServiceClient("https://10.0.0.119:8081");
  if (!process.env.SERVER_URL) {
    throw new Error("SERVER_URL is not set");
  }
  client = new EchoServiceClient(process.env.SERVER_URL);
  userInfo = new UserInfo();
  if (userId) {
    userInfo.setId(userId);
  } else {
    userInfo.setId(new Date().getTime().toString());
  }
  userInfo.setType(type);
  userInfo.setDataset(dataset);
  if (roomId) {
    userInfo.setRoomid(roomId);
  }

  return new Promise<UserInfo>((resolve, reject) => {
    client.join(userInfo, {}, (err, response: UserInfo) => {
      resolve(response);
    });
  });
}

function joinRoom(roomId: string) {
  userInfo = userInfo.setRoomid(roomId);

  return new Promise<UserInfo>((resolve, reject) => {
    client.join(userInfo, {}, (err, response) => {
      // console.log(err, response);
      resolve(response);
    });
  });
}

function useClient() {
  return client;
}

function leave() {
  console.log("leave");
  const user = store.getState().user.userInfo;
  if (user) {
    client.leave(user, {}, (err, response) => {
      console.log(err, response);
    });
  } else {
    console.error("user is not set");
  }
}

function pushStatus(
  user: UserInfo | null,
  camera: THREE.Camera,
  graph?: THREE.Object3D,
  documentPanel?: THREE.Object3D,
  tempVector = new THREE.Vector3(),
  tempQuaternion = new THREE.Quaternion()
) {
  if (user) {
    let frustum = computeUserFrustum(camera, graph, tempVector);
    user.setFrustum(frustum);

    let spatialInfo = computeUserSpatialInfo(
      camera,
      graph,
      tempVector,
      tempQuaternion
    );
    // console.log(spatialInfo.toObject());
    user.setHeadspatialinfo(spatialInfo);

    if (graph) {
      user.setGraphspatialinfo(computeGraphSpatialInfo(graph));
    }

    if (documentPanel) {
      user.setDocumentpanelspatialinfo(computeGraphSpatialInfo(documentPanel));
    }

    const nodesNearbyCursor = store.getState().user.nodesNearbyCursor;
    user.setNearcursornodeidsList(nodesNearbyCursor.map((node) => `${node.nodeId}`));
    user.setNearcursornodeweightsList(
      nodesNearbyCursor.map((node) => node.weight)
    );

    // TODO: this might produce a lot of traffic
    // HACK: reduce the traffic before joining the room
    if (user.getRoomid()) {
      client.updateUserStatus(user, {}, () => {
        // console.log("update user status success");
      });
    }
  }
}

function streamUserList(
  roomId: string,
  callback: (respoence: UserList) => void
) {
  console.log("stream user list");

  let request = new RequestById();
  request.setId(roomId);
  let stream = client.getAllUsersByRoomId(request, {});
  return stream
    .on("data", (response) => {
      callback(response);
    })
    .on("end", function () {
      console.log("Stream ended");
      streamUserList(roomId, callback);
    })
    .on("error", function (err) {
      console.log("Stream error: " + err);
    });
}

function streamDocumentState(
  roomId: string,
  callback: (response: DocumentState) => void
) {
  console.log("stream document state");

  let request = new RequestById();
  request.setId(roomId);
  let stream = client.getDocumentState(request, {});
  return stream
    .on("data", (response) => {
      callback(response);
    })
    .on("end", function () {
      console.log("Stream ended");
      streamDocumentState(roomId, callback);
    })
    .on("error", function (err) {
      console.log("Stream error: " + err);
    });
}

function streamGraph(roomId: string, callback: (response: any) => void) {
  console.log("stream graph");

  let request = new RequestById();
  request.setId(roomId);
  let stream = client.getGraphData(request, {});
  return stream
    .on("data", (response) => {
      callback(response);
    })
    .on("end", function () {
      console.log("Stream ended");
      streamGraph(roomId, callback);
    })
    .on("error", function (err) {
      console.log("Stream error: " + err);
    });
}

function streamNodes(
  userId: string,
  graphType: InitialRequest.ClientViewType,
  callback: (response: any) => void
) {
  console.log("stream nodes");

  let initialRequest = new InitialRequest();
  initialRequest.setUserid(userId);
  initialRequest.setRoomid(store.getState().user.userInfo.getRoomid());
  initialRequest.setRequestedviewtype(graphType);

  let stream = client.getNodes(initialRequest, {});
  return stream
    .on("data", (response) => {
      callback(response);
    })
    .on("end", function () {
      console.log("Stream ended");
      streamNodes(userId, graphType, callback);
    })
    .on("error", function (err) {
      console.log("Stream error: " + err);
    });
}

function streamGraphStatus(roomId: string, callback: (response: any) => void) {
  console.log("stream graph state");

  let request = new RequestById();
  request.setId(roomId);

  let stream = client.getNodesStatus(request, {});
  return stream
    .on("data", (response) => {
      callback(response);
    })
    .on("end", function () {
      console.log("Stream ended");
      streamGraphStatus(roomId, callback);
    })
    .on("error", function (err) {
      console.log("Stream error: " + err);
    });
}

function streamBoardcastMessage(
  roomId: string,
  userId: string,
  callback: (response: BoardcastMessage) => void
) {
  console.log("stream boardcast messages");

  let request = new RequestById();
  request.setId(roomId);
  request.setUserid(userId);
  request.setRoomid(roomId);

  let stream = client.getBoardcastMessage(request, {});
  return stream
    .on("data", (response) => {
      callback(response);
    })
    .on("end", function () {
      console.log("Stream ended");
      streamBoardcastMessage(roomId, userId, callback);
    })
    .on("error", function (err) {
      console.log("Stream error: " + err);

      // HACK: not sure why this stream will have error, restart it
      streamBoardcastMessage(roomId, userId, callback);
    });
}

function sendMessage(
  userId: string,
  message: string,
  actionType: BoardcastMessage.Action
) {
  let msg = new BoardcastMessage();
  msg.setUserid(userId);
  msg.setRoomid(store.getState().user.userInfo.getRoomid());
  msg.setMsg(message);
  msg.setAction(actionType);
  client.sendBoardcastMessage(msg, {}, (err, response) => {
    console.log(err, response);
  });
}

export {
  initConnection,
  joinRoom,
  useClient,
  leave,
  pushStatus,
  streamUserList,
  streamDocumentState,
  streamGraph,
  streamGraphStatus,
  streamNodes,
  streamBoardcastMessage,
  sendMessage,
};
