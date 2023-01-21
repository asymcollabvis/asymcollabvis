// package: 
// file: message.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as message_pb from "./message_pb.cjs";

interface IEchoServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getInitialGraphData: IEchoServiceService_IGetInitialGraphData;
    updateNodesStatus: IEchoServiceService_IUpdateNodesStatus;
    getGraphData: IEchoServiceService_IGetGraphData;
    getNodes: IEchoServiceService_IGetNodes;
    getLinks: IEchoServiceService_IGetLinks;
    getNodesStatus: IEchoServiceService_IGetNodesStatus;
    getAllUsers: IEchoServiceService_IGetAllUsers;
    getAllUsersByRoomId: IEchoServiceService_IGetAllUsersByRoomId;
    getAllRooms: IEchoServiceService_IGetAllRooms;
    join: IEchoServiceService_IJoin;
    leave: IEchoServiceService_ILeave;
    updateUserStatus: IEchoServiceService_IUpdateUserStatus;
    addNode: IEchoServiceService_IAddNode;
    updateNode: IEchoServiceService_IUpdateNode;
    removeNode: IEchoServiceService_IRemoveNode;
    mergeNodes: IEchoServiceService_IMergeNodes;
    addLink: IEchoServiceService_IAddLink;
    updateLink: IEchoServiceService_IUpdateLink;
    removeLink: IEchoServiceService_IRemoveLink;
    getDoument: IEchoServiceService_IGetDoument;
    updateDocumentState: IEchoServiceService_IUpdateDocumentState;
    getAllDouments: IEchoServiceService_IGetAllDouments;
    getDocumentState: IEchoServiceService_IGetDocumentState;
    sendBoardcastMessage: IEchoServiceService_ISendBoardcastMessage;
    getBoardcastMessage: IEchoServiceService_IGetBoardcastMessage;
    getReplayList: IEchoServiceService_IGetReplayList;
    getReplay: IEchoServiceService_IGetReplay;
}

interface IEchoServiceService_IGetInitialGraphData extends grpc.MethodDefinition<message_pb.InitialRequest, message_pb.InitialGraphData> {
    path: "/EchoService/GetInitialGraphData";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.InitialRequest>;
    requestDeserialize: grpc.deserialize<message_pb.InitialRequest>;
    responseSerialize: grpc.serialize<message_pb.InitialGraphData>;
    responseDeserialize: grpc.deserialize<message_pb.InitialGraphData>;
}
interface IEchoServiceService_IUpdateNodesStatus extends grpc.MethodDefinition<message_pb.ClientActions, message_pb.ServerNodesStatus> {
    path: "/EchoService/UpdateNodesStatus";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.ClientActions>;
    requestDeserialize: grpc.deserialize<message_pb.ClientActions>;
    responseSerialize: grpc.serialize<message_pb.ServerNodesStatus>;
    responseDeserialize: grpc.deserialize<message_pb.ServerNodesStatus>;
}
interface IEchoServiceService_IGetGraphData extends grpc.MethodDefinition<message_pb.RequestById, message_pb.GraphViewData> {
    path: "/EchoService/GetGraphData";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.RequestById>;
    requestDeserialize: grpc.deserialize<message_pb.RequestById>;
    responseSerialize: grpc.serialize<message_pb.GraphViewData>;
    responseDeserialize: grpc.deserialize<message_pb.GraphViewData>;
}
interface IEchoServiceService_IGetNodes extends grpc.MethodDefinition<message_pb.InitialRequest, message_pb.NodeList> {
    path: "/EchoService/GetNodes";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.InitialRequest>;
    requestDeserialize: grpc.deserialize<message_pb.InitialRequest>;
    responseSerialize: grpc.serialize<message_pb.NodeList>;
    responseDeserialize: grpc.deserialize<message_pb.NodeList>;
}
interface IEchoServiceService_IGetLinks extends grpc.MethodDefinition<message_pb.RequestById, message_pb.LinkList> {
    path: "/EchoService/GetLinks";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.RequestById>;
    requestDeserialize: grpc.deserialize<message_pb.RequestById>;
    responseSerialize: grpc.serialize<message_pb.LinkList>;
    responseDeserialize: grpc.deserialize<message_pb.LinkList>;
}
interface IEchoServiceService_IGetNodesStatus extends grpc.MethodDefinition<message_pb.RequestById, message_pb.ServerNodesStatus> {
    path: "/EchoService/GetNodesStatus";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.RequestById>;
    requestDeserialize: grpc.deserialize<message_pb.RequestById>;
    responseSerialize: grpc.serialize<message_pb.ServerNodesStatus>;
    responseDeserialize: grpc.deserialize<message_pb.ServerNodesStatus>;
}
interface IEchoServiceService_IGetAllUsers extends grpc.MethodDefinition<message_pb.EmptyMessage, message_pb.UserList> {
    path: "/EchoService/GetAllUsers";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.EmptyMessage>;
    requestDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
    responseSerialize: grpc.serialize<message_pb.UserList>;
    responseDeserialize: grpc.deserialize<message_pb.UserList>;
}
interface IEchoServiceService_IGetAllUsersByRoomId extends grpc.MethodDefinition<message_pb.RequestById, message_pb.UserList> {
    path: "/EchoService/GetAllUsersByRoomId";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.RequestById>;
    requestDeserialize: grpc.deserialize<message_pb.RequestById>;
    responseSerialize: grpc.serialize<message_pb.UserList>;
    responseDeserialize: grpc.deserialize<message_pb.UserList>;
}
interface IEchoServiceService_IGetAllRooms extends grpc.MethodDefinition<message_pb.EmptyMessage, message_pb.RoomList> {
    path: "/EchoService/GetAllRooms";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.EmptyMessage>;
    requestDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
    responseSerialize: grpc.serialize<message_pb.RoomList>;
    responseDeserialize: grpc.deserialize<message_pb.RoomList>;
}
interface IEchoServiceService_IJoin extends grpc.MethodDefinition<message_pb.UserInfo, message_pb.UserInfo> {
    path: "/EchoService/Join";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.UserInfo>;
    requestDeserialize: grpc.deserialize<message_pb.UserInfo>;
    responseSerialize: grpc.serialize<message_pb.UserInfo>;
    responseDeserialize: grpc.deserialize<message_pb.UserInfo>;
}
interface IEchoServiceService_ILeave extends grpc.MethodDefinition<message_pb.UserInfo, message_pb.EmptyMessage> {
    path: "/EchoService/Leave";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.UserInfo>;
    requestDeserialize: grpc.deserialize<message_pb.UserInfo>;
    responseSerialize: grpc.serialize<message_pb.EmptyMessage>;
    responseDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
}
interface IEchoServiceService_IUpdateUserStatus extends grpc.MethodDefinition<message_pb.UserInfo, message_pb.EmptyMessage> {
    path: "/EchoService/UpdateUserStatus";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.UserInfo>;
    requestDeserialize: grpc.deserialize<message_pb.UserInfo>;
    responseSerialize: grpc.serialize<message_pb.EmptyMessage>;
    responseDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
}
interface IEchoServiceService_IAddNode extends grpc.MethodDefinition<message_pb.Node, message_pb.Node> {
    path: "/EchoService/AddNode";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.Node>;
    requestDeserialize: grpc.deserialize<message_pb.Node>;
    responseSerialize: grpc.serialize<message_pb.Node>;
    responseDeserialize: grpc.deserialize<message_pb.Node>;
}
interface IEchoServiceService_IUpdateNode extends grpc.MethodDefinition<message_pb.Node, message_pb.EmptyMessage> {
    path: "/EchoService/UpdateNode";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.Node>;
    requestDeserialize: grpc.deserialize<message_pb.Node>;
    responseSerialize: grpc.serialize<message_pb.EmptyMessage>;
    responseDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
}
interface IEchoServiceService_IRemoveNode extends grpc.MethodDefinition<message_pb.Node, message_pb.EmptyMessage> {
    path: "/EchoService/RemoveNode";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.Node>;
    requestDeserialize: grpc.deserialize<message_pb.Node>;
    responseSerialize: grpc.serialize<message_pb.EmptyMessage>;
    responseDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
}
interface IEchoServiceService_IMergeNodes extends grpc.MethodDefinition<message_pb.NodeList, message_pb.EmptyMessage> {
    path: "/EchoService/MergeNodes";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.NodeList>;
    requestDeserialize: grpc.deserialize<message_pb.NodeList>;
    responseSerialize: grpc.serialize<message_pb.EmptyMessage>;
    responseDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
}
interface IEchoServiceService_IAddLink extends grpc.MethodDefinition<message_pb.Link, message_pb.EmptyMessage> {
    path: "/EchoService/AddLink";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.Link>;
    requestDeserialize: grpc.deserialize<message_pb.Link>;
    responseSerialize: grpc.serialize<message_pb.EmptyMessage>;
    responseDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
}
interface IEchoServiceService_IUpdateLink extends grpc.MethodDefinition<message_pb.Link, message_pb.EmptyMessage> {
    path: "/EchoService/UpdateLink";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.Link>;
    requestDeserialize: grpc.deserialize<message_pb.Link>;
    responseSerialize: grpc.serialize<message_pb.EmptyMessage>;
    responseDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
}
interface IEchoServiceService_IRemoveLink extends grpc.MethodDefinition<message_pb.Link, message_pb.EmptyMessage> {
    path: "/EchoService/RemoveLink";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.Link>;
    requestDeserialize: grpc.deserialize<message_pb.Link>;
    responseSerialize: grpc.serialize<message_pb.EmptyMessage>;
    responseDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
}
interface IEchoServiceService_IGetDoument extends grpc.MethodDefinition<message_pb.RequestById, message_pb.Document> {
    path: "/EchoService/GetDoument";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.RequestById>;
    requestDeserialize: grpc.deserialize<message_pb.RequestById>;
    responseSerialize: grpc.serialize<message_pb.Document>;
    responseDeserialize: grpc.deserialize<message_pb.Document>;
}
interface IEchoServiceService_IUpdateDocumentState extends grpc.MethodDefinition<message_pb.RequestById, message_pb.EmptyMessage> {
    path: "/EchoService/UpdateDocumentState";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.RequestById>;
    requestDeserialize: grpc.deserialize<message_pb.RequestById>;
    responseSerialize: grpc.serialize<message_pb.EmptyMessage>;
    responseDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
}
interface IEchoServiceService_IGetAllDouments extends grpc.MethodDefinition<message_pb.RequestById, message_pb.DocumentList> {
    path: "/EchoService/GetAllDouments";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.RequestById>;
    requestDeserialize: grpc.deserialize<message_pb.RequestById>;
    responseSerialize: grpc.serialize<message_pb.DocumentList>;
    responseDeserialize: grpc.deserialize<message_pb.DocumentList>;
}
interface IEchoServiceService_IGetDocumentState extends grpc.MethodDefinition<message_pb.RequestById, message_pb.DocumentState> {
    path: "/EchoService/GetDocumentState";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.RequestById>;
    requestDeserialize: grpc.deserialize<message_pb.RequestById>;
    responseSerialize: grpc.serialize<message_pb.DocumentState>;
    responseDeserialize: grpc.deserialize<message_pb.DocumentState>;
}
interface IEchoServiceService_ISendBoardcastMessage extends grpc.MethodDefinition<message_pb.BoardcastMessage, message_pb.EmptyMessage> {
    path: "/EchoService/SendBoardcastMessage";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.BoardcastMessage>;
    requestDeserialize: grpc.deserialize<message_pb.BoardcastMessage>;
    responseSerialize: grpc.serialize<message_pb.EmptyMessage>;
    responseDeserialize: grpc.deserialize<message_pb.EmptyMessage>;
}
interface IEchoServiceService_IGetBoardcastMessage extends grpc.MethodDefinition<message_pb.RequestById, message_pb.BoardcastMessage> {
    path: "/EchoService/GetBoardcastMessage";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.RequestById>;
    requestDeserialize: grpc.deserialize<message_pb.RequestById>;
    responseSerialize: grpc.serialize<message_pb.BoardcastMessage>;
    responseDeserialize: grpc.deserialize<message_pb.BoardcastMessage>;
}
interface IEchoServiceService_IGetReplayList extends grpc.MethodDefinition<message_pb.RequestById, message_pb.ReplayList> {
    path: "/EchoService/GetReplayList";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.RequestById>;
    requestDeserialize: grpc.deserialize<message_pb.RequestById>;
    responseSerialize: grpc.serialize<message_pb.ReplayList>;
    responseDeserialize: grpc.deserialize<message_pb.ReplayList>;
}
interface IEchoServiceService_IGetReplay extends grpc.MethodDefinition<message_pb.ReplayMessage, message_pb.ReplayMessage> {
    path: "/EchoService/GetReplay";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.ReplayMessage>;
    requestDeserialize: grpc.deserialize<message_pb.ReplayMessage>;
    responseSerialize: grpc.serialize<message_pb.ReplayMessage>;
    responseDeserialize: grpc.deserialize<message_pb.ReplayMessage>;
}

export const EchoServiceService: IEchoServiceService;

export interface IEchoServiceServer {
    getInitialGraphData: grpc.handleUnaryCall<message_pb.InitialRequest, message_pb.InitialGraphData>;
    updateNodesStatus: grpc.handleUnaryCall<message_pb.ClientActions, message_pb.ServerNodesStatus>;
    getGraphData: grpc.handleServerStreamingCall<message_pb.RequestById, message_pb.GraphViewData>;
    getNodes: grpc.handleServerStreamingCall<message_pb.InitialRequest, message_pb.NodeList>;
    getLinks: grpc.handleServerStreamingCall<message_pb.RequestById, message_pb.LinkList>;
    getNodesStatus: grpc.handleServerStreamingCall<message_pb.RequestById, message_pb.ServerNodesStatus>;
    getAllUsers: grpc.handleServerStreamingCall<message_pb.EmptyMessage, message_pb.UserList>;
    getAllUsersByRoomId: grpc.handleServerStreamingCall<message_pb.RequestById, message_pb.UserList>;
    getAllRooms: grpc.handleServerStreamingCall<message_pb.EmptyMessage, message_pb.RoomList>;
    join: grpc.handleUnaryCall<message_pb.UserInfo, message_pb.UserInfo>;
    leave: grpc.handleUnaryCall<message_pb.UserInfo, message_pb.EmptyMessage>;
    updateUserStatus: grpc.handleUnaryCall<message_pb.UserInfo, message_pb.EmptyMessage>;
    addNode: grpc.handleUnaryCall<message_pb.Node, message_pb.Node>;
    updateNode: grpc.handleUnaryCall<message_pb.Node, message_pb.EmptyMessage>;
    removeNode: grpc.handleUnaryCall<message_pb.Node, message_pb.EmptyMessage>;
    mergeNodes: grpc.handleUnaryCall<message_pb.NodeList, message_pb.EmptyMessage>;
    addLink: grpc.handleUnaryCall<message_pb.Link, message_pb.EmptyMessage>;
    updateLink: grpc.handleUnaryCall<message_pb.Link, message_pb.EmptyMessage>;
    removeLink: grpc.handleUnaryCall<message_pb.Link, message_pb.EmptyMessage>;
    getDoument: grpc.handleUnaryCall<message_pb.RequestById, message_pb.Document>;
    updateDocumentState: grpc.handleUnaryCall<message_pb.RequestById, message_pb.EmptyMessage>;
    getAllDouments: grpc.handleServerStreamingCall<message_pb.RequestById, message_pb.DocumentList>;
    getDocumentState: grpc.handleServerStreamingCall<message_pb.RequestById, message_pb.DocumentState>;
    sendBoardcastMessage: grpc.handleUnaryCall<message_pb.BoardcastMessage, message_pb.EmptyMessage>;
    getBoardcastMessage: grpc.handleServerStreamingCall<message_pb.RequestById, message_pb.BoardcastMessage>;
    getReplayList: grpc.handleUnaryCall<message_pb.RequestById, message_pb.ReplayList>;
    getReplay: grpc.handleServerStreamingCall<message_pb.ReplayMessage, message_pb.ReplayMessage>;
}

export interface IEchoServiceClient {
    getInitialGraphData(request: message_pb.InitialRequest, callback: (error: grpc.ServiceError | null, response: message_pb.InitialGraphData) => void): grpc.ClientUnaryCall;
    getInitialGraphData(request: message_pb.InitialRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.InitialGraphData) => void): grpc.ClientUnaryCall;
    getInitialGraphData(request: message_pb.InitialRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.InitialGraphData) => void): grpc.ClientUnaryCall;
    updateNodesStatus(request: message_pb.ClientActions, callback: (error: grpc.ServiceError | null, response: message_pb.ServerNodesStatus) => void): grpc.ClientUnaryCall;
    updateNodesStatus(request: message_pb.ClientActions, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.ServerNodesStatus) => void): grpc.ClientUnaryCall;
    updateNodesStatus(request: message_pb.ClientActions, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.ServerNodesStatus) => void): grpc.ClientUnaryCall;
    getGraphData(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.GraphViewData>;
    getGraphData(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.GraphViewData>;
    getNodes(request: message_pb.InitialRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.NodeList>;
    getNodes(request: message_pb.InitialRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.NodeList>;
    getLinks(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.LinkList>;
    getLinks(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.LinkList>;
    getNodesStatus(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.ServerNodesStatus>;
    getNodesStatus(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.ServerNodesStatus>;
    getAllUsers(request: message_pb.EmptyMessage, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.UserList>;
    getAllUsers(request: message_pb.EmptyMessage, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.UserList>;
    getAllUsersByRoomId(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.UserList>;
    getAllUsersByRoomId(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.UserList>;
    getAllRooms(request: message_pb.EmptyMessage, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.RoomList>;
    getAllRooms(request: message_pb.EmptyMessage, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.RoomList>;
    join(request: message_pb.UserInfo, callback: (error: grpc.ServiceError | null, response: message_pb.UserInfo) => void): grpc.ClientUnaryCall;
    join(request: message_pb.UserInfo, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.UserInfo) => void): grpc.ClientUnaryCall;
    join(request: message_pb.UserInfo, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.UserInfo) => void): grpc.ClientUnaryCall;
    leave(request: message_pb.UserInfo, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    leave(request: message_pb.UserInfo, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    leave(request: message_pb.UserInfo, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    updateUserStatus(request: message_pb.UserInfo, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    updateUserStatus(request: message_pb.UserInfo, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    updateUserStatus(request: message_pb.UserInfo, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    addNode(request: message_pb.Node, callback: (error: grpc.ServiceError | null, response: message_pb.Node) => void): grpc.ClientUnaryCall;
    addNode(request: message_pb.Node, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.Node) => void): grpc.ClientUnaryCall;
    addNode(request: message_pb.Node, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.Node) => void): grpc.ClientUnaryCall;
    updateNode(request: message_pb.Node, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    updateNode(request: message_pb.Node, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    updateNode(request: message_pb.Node, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    removeNode(request: message_pb.Node, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    removeNode(request: message_pb.Node, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    removeNode(request: message_pb.Node, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    mergeNodes(request: message_pb.NodeList, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    mergeNodes(request: message_pb.NodeList, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    mergeNodes(request: message_pb.NodeList, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    addLink(request: message_pb.Link, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    addLink(request: message_pb.Link, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    addLink(request: message_pb.Link, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    updateLink(request: message_pb.Link, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    updateLink(request: message_pb.Link, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    updateLink(request: message_pb.Link, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    removeLink(request: message_pb.Link, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    removeLink(request: message_pb.Link, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    removeLink(request: message_pb.Link, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    getDoument(request: message_pb.RequestById, callback: (error: grpc.ServiceError | null, response: message_pb.Document) => void): grpc.ClientUnaryCall;
    getDoument(request: message_pb.RequestById, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.Document) => void): grpc.ClientUnaryCall;
    getDoument(request: message_pb.RequestById, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.Document) => void): grpc.ClientUnaryCall;
    updateDocumentState(request: message_pb.RequestById, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    updateDocumentState(request: message_pb.RequestById, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    updateDocumentState(request: message_pb.RequestById, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    getAllDouments(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.DocumentList>;
    getAllDouments(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.DocumentList>;
    getDocumentState(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.DocumentState>;
    getDocumentState(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.DocumentState>;
    sendBoardcastMessage(request: message_pb.BoardcastMessage, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    sendBoardcastMessage(request: message_pb.BoardcastMessage, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    sendBoardcastMessage(request: message_pb.BoardcastMessage, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    getBoardcastMessage(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.BoardcastMessage>;
    getBoardcastMessage(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.BoardcastMessage>;
    getReplayList(request: message_pb.RequestById, callback: (error: grpc.ServiceError | null, response: message_pb.ReplayList) => void): grpc.ClientUnaryCall;
    getReplayList(request: message_pb.RequestById, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.ReplayList) => void): grpc.ClientUnaryCall;
    getReplayList(request: message_pb.RequestById, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.ReplayList) => void): grpc.ClientUnaryCall;
    getReplay(request: message_pb.ReplayMessage, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.ReplayMessage>;
    getReplay(request: message_pb.ReplayMessage, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.ReplayMessage>;
}

export class EchoServiceClient extends grpc.Client implements IEchoServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getInitialGraphData(request: message_pb.InitialRequest, callback: (error: grpc.ServiceError | null, response: message_pb.InitialGraphData) => void): grpc.ClientUnaryCall;
    public getInitialGraphData(request: message_pb.InitialRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.InitialGraphData) => void): grpc.ClientUnaryCall;
    public getInitialGraphData(request: message_pb.InitialRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.InitialGraphData) => void): grpc.ClientUnaryCall;
    public updateNodesStatus(request: message_pb.ClientActions, callback: (error: grpc.ServiceError | null, response: message_pb.ServerNodesStatus) => void): grpc.ClientUnaryCall;
    public updateNodesStatus(request: message_pb.ClientActions, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.ServerNodesStatus) => void): grpc.ClientUnaryCall;
    public updateNodesStatus(request: message_pb.ClientActions, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.ServerNodesStatus) => void): grpc.ClientUnaryCall;
    public getGraphData(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.GraphViewData>;
    public getGraphData(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.GraphViewData>;
    public getNodes(request: message_pb.InitialRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.NodeList>;
    public getNodes(request: message_pb.InitialRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.NodeList>;
    public getLinks(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.LinkList>;
    public getLinks(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.LinkList>;
    public getNodesStatus(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.ServerNodesStatus>;
    public getNodesStatus(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.ServerNodesStatus>;
    public getAllUsers(request: message_pb.EmptyMessage, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.UserList>;
    public getAllUsers(request: message_pb.EmptyMessage, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.UserList>;
    public getAllUsersByRoomId(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.UserList>;
    public getAllUsersByRoomId(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.UserList>;
    public getAllRooms(request: message_pb.EmptyMessage, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.RoomList>;
    public getAllRooms(request: message_pb.EmptyMessage, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.RoomList>;
    public join(request: message_pb.UserInfo, callback: (error: grpc.ServiceError | null, response: message_pb.UserInfo) => void): grpc.ClientUnaryCall;
    public join(request: message_pb.UserInfo, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.UserInfo) => void): grpc.ClientUnaryCall;
    public join(request: message_pb.UserInfo, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.UserInfo) => void): grpc.ClientUnaryCall;
    public leave(request: message_pb.UserInfo, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public leave(request: message_pb.UserInfo, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public leave(request: message_pb.UserInfo, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public updateUserStatus(request: message_pb.UserInfo, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public updateUserStatus(request: message_pb.UserInfo, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public updateUserStatus(request: message_pb.UserInfo, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public addNode(request: message_pb.Node, callback: (error: grpc.ServiceError | null, response: message_pb.Node) => void): grpc.ClientUnaryCall;
    public addNode(request: message_pb.Node, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.Node) => void): grpc.ClientUnaryCall;
    public addNode(request: message_pb.Node, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.Node) => void): grpc.ClientUnaryCall;
    public updateNode(request: message_pb.Node, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public updateNode(request: message_pb.Node, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public updateNode(request: message_pb.Node, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public removeNode(request: message_pb.Node, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public removeNode(request: message_pb.Node, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public removeNode(request: message_pb.Node, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public mergeNodes(request: message_pb.NodeList, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public mergeNodes(request: message_pb.NodeList, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public mergeNodes(request: message_pb.NodeList, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public addLink(request: message_pb.Link, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public addLink(request: message_pb.Link, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public addLink(request: message_pb.Link, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public updateLink(request: message_pb.Link, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public updateLink(request: message_pb.Link, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public updateLink(request: message_pb.Link, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public removeLink(request: message_pb.Link, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public removeLink(request: message_pb.Link, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public removeLink(request: message_pb.Link, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public getDoument(request: message_pb.RequestById, callback: (error: grpc.ServiceError | null, response: message_pb.Document) => void): grpc.ClientUnaryCall;
    public getDoument(request: message_pb.RequestById, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.Document) => void): grpc.ClientUnaryCall;
    public getDoument(request: message_pb.RequestById, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.Document) => void): grpc.ClientUnaryCall;
    public updateDocumentState(request: message_pb.RequestById, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public updateDocumentState(request: message_pb.RequestById, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public updateDocumentState(request: message_pb.RequestById, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public getAllDouments(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.DocumentList>;
    public getAllDouments(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.DocumentList>;
    public getDocumentState(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.DocumentState>;
    public getDocumentState(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.DocumentState>;
    public sendBoardcastMessage(request: message_pb.BoardcastMessage, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public sendBoardcastMessage(request: message_pb.BoardcastMessage, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public sendBoardcastMessage(request: message_pb.BoardcastMessage, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.EmptyMessage) => void): grpc.ClientUnaryCall;
    public getBoardcastMessage(request: message_pb.RequestById, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.BoardcastMessage>;
    public getBoardcastMessage(request: message_pb.RequestById, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.BoardcastMessage>;
    public getReplayList(request: message_pb.RequestById, callback: (error: grpc.ServiceError | null, response: message_pb.ReplayList) => void): grpc.ClientUnaryCall;
    public getReplayList(request: message_pb.RequestById, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.ReplayList) => void): grpc.ClientUnaryCall;
    public getReplayList(request: message_pb.RequestById, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.ReplayList) => void): grpc.ClientUnaryCall;
    public getReplay(request: message_pb.ReplayMessage, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.ReplayMessage>;
    public getReplay(request: message_pb.ReplayMessage, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.ReplayMessage>;
}
