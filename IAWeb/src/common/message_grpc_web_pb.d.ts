import * as grpcWeb from 'grpc-web';

import * as message_pb from './message_pb';


export class EchoServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getInitialGraphData(
    request: message_pb.InitialRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.InitialGraphData) => void
  ): grpcWeb.ClientReadableStream<message_pb.InitialGraphData>;

  updateNodesStatus(
    request: message_pb.ClientActions,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.ServerNodesStatus) => void
  ): grpcWeb.ClientReadableStream<message_pb.ServerNodesStatus>;

  getGraphData(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.GraphViewData>;

  getNodes(
    request: message_pb.InitialRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.NodeList>;

  getLinks(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.LinkList>;

  getNodesStatus(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.ServerNodesStatus>;

  getAllUsers(
    request: message_pb.EmptyMessage,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.UserList>;

  getAllUsersByRoomId(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.UserList>;

  getAllRooms(
    request: message_pb.EmptyMessage,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.RoomList>;

  join(
    request: message_pb.UserInfo,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.UserInfo) => void
  ): grpcWeb.ClientReadableStream<message_pb.UserInfo>;

  leave(
    request: message_pb.UserInfo,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.EmptyMessage) => void
  ): grpcWeb.ClientReadableStream<message_pb.EmptyMessage>;

  updateUserStatus(
    request: message_pb.UserInfo,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.EmptyMessage) => void
  ): grpcWeb.ClientReadableStream<message_pb.EmptyMessage>;

  addNode(
    request: message_pb.Node,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.Node) => void
  ): grpcWeb.ClientReadableStream<message_pb.Node>;

  updateNode(
    request: message_pb.Node,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.EmptyMessage) => void
  ): grpcWeb.ClientReadableStream<message_pb.EmptyMessage>;

  removeNode(
    request: message_pb.Node,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.EmptyMessage) => void
  ): grpcWeb.ClientReadableStream<message_pb.EmptyMessage>;

  mergeNodes(
    request: message_pb.NodeList,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.EmptyMessage) => void
  ): grpcWeb.ClientReadableStream<message_pb.EmptyMessage>;

  addLink(
    request: message_pb.Link,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.EmptyMessage) => void
  ): grpcWeb.ClientReadableStream<message_pb.EmptyMessage>;

  updateLink(
    request: message_pb.Link,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.EmptyMessage) => void
  ): grpcWeb.ClientReadableStream<message_pb.EmptyMessage>;

  removeLink(
    request: message_pb.Link,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.EmptyMessage) => void
  ): grpcWeb.ClientReadableStream<message_pb.EmptyMessage>;

  getDoument(
    request: message_pb.RequestById,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.Document) => void
  ): grpcWeb.ClientReadableStream<message_pb.Document>;

  updateDocumentState(
    request: message_pb.RequestById,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.EmptyMessage) => void
  ): grpcWeb.ClientReadableStream<message_pb.EmptyMessage>;

  getAllDouments(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.DocumentList>;

  getDocumentState(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.DocumentState>;

  sendBoardcastMessage(
    request: message_pb.BoardcastMessage,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.EmptyMessage) => void
  ): grpcWeb.ClientReadableStream<message_pb.EmptyMessage>;

  getBoardcastMessage(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.BoardcastMessage>;

  getReplayList(
    request: message_pb.RequestById,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: message_pb.ReplayList) => void
  ): grpcWeb.ClientReadableStream<message_pb.ReplayList>;

  getReplay(
    request: message_pb.ReplayMessage,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.ReplayMessage>;

}

export class EchoServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getInitialGraphData(
    request: message_pb.InitialRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.InitialGraphData>;

  updateNodesStatus(
    request: message_pb.ClientActions,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.ServerNodesStatus>;

  getGraphData(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.GraphViewData>;

  getNodes(
    request: message_pb.InitialRequest,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.NodeList>;

  getLinks(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.LinkList>;

  getNodesStatus(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.ServerNodesStatus>;

  getAllUsers(
    request: message_pb.EmptyMessage,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.UserList>;

  getAllUsersByRoomId(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.UserList>;

  getAllRooms(
    request: message_pb.EmptyMessage,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.RoomList>;

  join(
    request: message_pb.UserInfo,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.UserInfo>;

  leave(
    request: message_pb.UserInfo,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.EmptyMessage>;

  updateUserStatus(
    request: message_pb.UserInfo,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.EmptyMessage>;

  addNode(
    request: message_pb.Node,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.Node>;

  updateNode(
    request: message_pb.Node,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.EmptyMessage>;

  removeNode(
    request: message_pb.Node,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.EmptyMessage>;

  mergeNodes(
    request: message_pb.NodeList,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.EmptyMessage>;

  addLink(
    request: message_pb.Link,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.EmptyMessage>;

  updateLink(
    request: message_pb.Link,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.EmptyMessage>;

  removeLink(
    request: message_pb.Link,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.EmptyMessage>;

  getDoument(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.Document>;

  updateDocumentState(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.EmptyMessage>;

  getAllDouments(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.DocumentList>;

  getDocumentState(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.DocumentState>;

  sendBoardcastMessage(
    request: message_pb.BoardcastMessage,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.EmptyMessage>;

  getBoardcastMessage(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.BoardcastMessage>;

  getReplayList(
    request: message_pb.RequestById,
    metadata?: grpcWeb.Metadata
  ): Promise<message_pb.ReplayList>;

  getReplay(
    request: message_pb.ReplayMessage,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<message_pb.ReplayMessage>;

}

