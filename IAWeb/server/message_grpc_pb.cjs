// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var message_pb = require('./message_pb.cjs');

function serialize_BoardcastMessage(arg) {
  if (!(arg instanceof message_pb.BoardcastMessage)) {
    throw new Error('Expected argument of type BoardcastMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_BoardcastMessage(buffer_arg) {
  return message_pb.BoardcastMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ClientActions(arg) {
  if (!(arg instanceof message_pb.ClientActions)) {
    throw new Error('Expected argument of type ClientActions');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ClientActions(buffer_arg) {
  return message_pb.ClientActions.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Document(arg) {
  if (!(arg instanceof message_pb.Document)) {
    throw new Error('Expected argument of type Document');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Document(buffer_arg) {
  return message_pb.Document.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DocumentList(arg) {
  if (!(arg instanceof message_pb.DocumentList)) {
    throw new Error('Expected argument of type DocumentList');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DocumentList(buffer_arg) {
  return message_pb.DocumentList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_DocumentState(arg) {
  if (!(arg instanceof message_pb.DocumentState)) {
    throw new Error('Expected argument of type DocumentState');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_DocumentState(buffer_arg) {
  return message_pb.DocumentState.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_EmptyMessage(arg) {
  if (!(arg instanceof message_pb.EmptyMessage)) {
    throw new Error('Expected argument of type EmptyMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_EmptyMessage(buffer_arg) {
  return message_pb.EmptyMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_GraphViewData(arg) {
  if (!(arg instanceof message_pb.GraphViewData)) {
    throw new Error('Expected argument of type GraphViewData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_GraphViewData(buffer_arg) {
  return message_pb.GraphViewData.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_InitialGraphData(arg) {
  if (!(arg instanceof message_pb.InitialGraphData)) {
    throw new Error('Expected argument of type InitialGraphData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_InitialGraphData(buffer_arg) {
  return message_pb.InitialGraphData.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_InitialRequest(arg) {
  if (!(arg instanceof message_pb.InitialRequest)) {
    throw new Error('Expected argument of type InitialRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_InitialRequest(buffer_arg) {
  return message_pb.InitialRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Link(arg) {
  if (!(arg instanceof message_pb.Link)) {
    throw new Error('Expected argument of type Link');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Link(buffer_arg) {
  return message_pb.Link.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_LinkList(arg) {
  if (!(arg instanceof message_pb.LinkList)) {
    throw new Error('Expected argument of type LinkList');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_LinkList(buffer_arg) {
  return message_pb.LinkList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_Node(arg) {
  if (!(arg instanceof message_pb.Node)) {
    throw new Error('Expected argument of type Node');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Node(buffer_arg) {
  return message_pb.Node.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_NodeList(arg) {
  if (!(arg instanceof message_pb.NodeList)) {
    throw new Error('Expected argument of type NodeList');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_NodeList(buffer_arg) {
  return message_pb.NodeList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ReplayList(arg) {
  if (!(arg instanceof message_pb.ReplayList)) {
    throw new Error('Expected argument of type ReplayList');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReplayList(buffer_arg) {
  return message_pb.ReplayList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ReplayMessage(arg) {
  if (!(arg instanceof message_pb.ReplayMessage)) {
    throw new Error('Expected argument of type ReplayMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ReplayMessage(buffer_arg) {
  return message_pb.ReplayMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RequestById(arg) {
  if (!(arg instanceof message_pb.RequestById)) {
    throw new Error('Expected argument of type RequestById');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RequestById(buffer_arg) {
  return message_pb.RequestById.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RoomList(arg) {
  if (!(arg instanceof message_pb.RoomList)) {
    throw new Error('Expected argument of type RoomList');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RoomList(buffer_arg) {
  return message_pb.RoomList.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ServerNodesStatus(arg) {
  if (!(arg instanceof message_pb.ServerNodesStatus)) {
    throw new Error('Expected argument of type ServerNodesStatus');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ServerNodesStatus(buffer_arg) {
  return message_pb.ServerNodesStatus.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UserInfo(arg) {
  if (!(arg instanceof message_pb.UserInfo)) {
    throw new Error('Expected argument of type UserInfo');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UserInfo(buffer_arg) {
  return message_pb.UserInfo.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_UserList(arg) {
  if (!(arg instanceof message_pb.UserList)) {
    throw new Error('Expected argument of type UserList');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_UserList(buffer_arg) {
  return message_pb.UserList.deserializeBinary(new Uint8Array(buffer_arg));
}


var EchoServiceService = exports.EchoServiceService = {
  getInitialGraphData: {
    path: '/EchoService/GetInitialGraphData',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.InitialRequest,
    responseType: message_pb.InitialGraphData,
    requestSerialize: serialize_InitialRequest,
    requestDeserialize: deserialize_InitialRequest,
    responseSerialize: serialize_InitialGraphData,
    responseDeserialize: deserialize_InitialGraphData,
  },
  updateNodesStatus: {
    path: '/EchoService/UpdateNodesStatus',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.ClientActions,
    responseType: message_pb.ServerNodesStatus,
    requestSerialize: serialize_ClientActions,
    requestDeserialize: deserialize_ClientActions,
    responseSerialize: serialize_ServerNodesStatus,
    responseDeserialize: deserialize_ServerNodesStatus,
  },
  getGraphData: {
    path: '/EchoService/GetGraphData',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.RequestById,
    responseType: message_pb.GraphViewData,
    requestSerialize: serialize_RequestById,
    requestDeserialize: deserialize_RequestById,
    responseSerialize: serialize_GraphViewData,
    responseDeserialize: deserialize_GraphViewData,
  },
  getNodes: {
    path: '/EchoService/GetNodes',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.InitialRequest,
    responseType: message_pb.NodeList,
    requestSerialize: serialize_InitialRequest,
    requestDeserialize: deserialize_InitialRequest,
    responseSerialize: serialize_NodeList,
    responseDeserialize: deserialize_NodeList,
  },
  getLinks: {
    path: '/EchoService/GetLinks',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.RequestById,
    responseType: message_pb.LinkList,
    requestSerialize: serialize_RequestById,
    requestDeserialize: deserialize_RequestById,
    responseSerialize: serialize_LinkList,
    responseDeserialize: deserialize_LinkList,
  },
  getNodesStatus: {
    path: '/EchoService/GetNodesStatus',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.RequestById,
    responseType: message_pb.ServerNodesStatus,
    requestSerialize: serialize_RequestById,
    requestDeserialize: deserialize_RequestById,
    responseSerialize: serialize_ServerNodesStatus,
    responseDeserialize: deserialize_ServerNodesStatus,
  },
  getAllUsers: {
    path: '/EchoService/GetAllUsers',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.EmptyMessage,
    responseType: message_pb.UserList,
    requestSerialize: serialize_EmptyMessage,
    requestDeserialize: deserialize_EmptyMessage,
    responseSerialize: serialize_UserList,
    responseDeserialize: deserialize_UserList,
  },
  getAllUsersByRoomId: {
    path: '/EchoService/GetAllUsersByRoomId',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.RequestById,
    responseType: message_pb.UserList,
    requestSerialize: serialize_RequestById,
    requestDeserialize: deserialize_RequestById,
    responseSerialize: serialize_UserList,
    responseDeserialize: deserialize_UserList,
  },
  getAllRooms: {
    path: '/EchoService/GetAllRooms',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.EmptyMessage,
    responseType: message_pb.RoomList,
    requestSerialize: serialize_EmptyMessage,
    requestDeserialize: deserialize_EmptyMessage,
    responseSerialize: serialize_RoomList,
    responseDeserialize: deserialize_RoomList,
  },
  join: {
    path: '/EchoService/Join',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.UserInfo,
    responseType: message_pb.UserInfo,
    requestSerialize: serialize_UserInfo,
    requestDeserialize: deserialize_UserInfo,
    responseSerialize: serialize_UserInfo,
    responseDeserialize: deserialize_UserInfo,
  },
  leave: {
    path: '/EchoService/Leave',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.UserInfo,
    responseType: message_pb.EmptyMessage,
    requestSerialize: serialize_UserInfo,
    requestDeserialize: deserialize_UserInfo,
    responseSerialize: serialize_EmptyMessage,
    responseDeserialize: deserialize_EmptyMessage,
  },
  updateUserStatus: {
    path: '/EchoService/UpdateUserStatus',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.UserInfo,
    responseType: message_pb.EmptyMessage,
    requestSerialize: serialize_UserInfo,
    requestDeserialize: deserialize_UserInfo,
    responseSerialize: serialize_EmptyMessage,
    responseDeserialize: deserialize_EmptyMessage,
  },
  addNode: {
    path: '/EchoService/AddNode',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.Node,
    responseType: message_pb.Node,
    requestSerialize: serialize_Node,
    requestDeserialize: deserialize_Node,
    responseSerialize: serialize_Node,
    responseDeserialize: deserialize_Node,
  },
  updateNode: {
    path: '/EchoService/UpdateNode',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.Node,
    responseType: message_pb.EmptyMessage,
    requestSerialize: serialize_Node,
    requestDeserialize: deserialize_Node,
    responseSerialize: serialize_EmptyMessage,
    responseDeserialize: deserialize_EmptyMessage,
  },
  removeNode: {
    path: '/EchoService/RemoveNode',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.Node,
    responseType: message_pb.EmptyMessage,
    requestSerialize: serialize_Node,
    requestDeserialize: deserialize_Node,
    responseSerialize: serialize_EmptyMessage,
    responseDeserialize: deserialize_EmptyMessage,
  },
  mergeNodes: {
    path: '/EchoService/MergeNodes',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.NodeList,
    responseType: message_pb.EmptyMessage,
    requestSerialize: serialize_NodeList,
    requestDeserialize: deserialize_NodeList,
    responseSerialize: serialize_EmptyMessage,
    responseDeserialize: deserialize_EmptyMessage,
  },
  addLink: {
    path: '/EchoService/AddLink',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.Link,
    responseType: message_pb.EmptyMessage,
    requestSerialize: serialize_Link,
    requestDeserialize: deserialize_Link,
    responseSerialize: serialize_EmptyMessage,
    responseDeserialize: deserialize_EmptyMessage,
  },
  updateLink: {
    path: '/EchoService/UpdateLink',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.Link,
    responseType: message_pb.EmptyMessage,
    requestSerialize: serialize_Link,
    requestDeserialize: deserialize_Link,
    responseSerialize: serialize_EmptyMessage,
    responseDeserialize: deserialize_EmptyMessage,
  },
  removeLink: {
    path: '/EchoService/RemoveLink',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.Link,
    responseType: message_pb.EmptyMessage,
    requestSerialize: serialize_Link,
    requestDeserialize: deserialize_Link,
    responseSerialize: serialize_EmptyMessage,
    responseDeserialize: deserialize_EmptyMessage,
  },
  getDoument: {
    path: '/EchoService/GetDoument',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.RequestById,
    responseType: message_pb.Document,
    requestSerialize: serialize_RequestById,
    requestDeserialize: deserialize_RequestById,
    responseSerialize: serialize_Document,
    responseDeserialize: deserialize_Document,
  },
  updateDocumentState: {
    path: '/EchoService/UpdateDocumentState',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.RequestById,
    responseType: message_pb.EmptyMessage,
    requestSerialize: serialize_RequestById,
    requestDeserialize: deserialize_RequestById,
    responseSerialize: serialize_EmptyMessage,
    responseDeserialize: deserialize_EmptyMessage,
  },
  getAllDouments: {
    path: '/EchoService/GetAllDouments',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.RequestById,
    responseType: message_pb.DocumentList,
    requestSerialize: serialize_RequestById,
    requestDeserialize: deserialize_RequestById,
    responseSerialize: serialize_DocumentList,
    responseDeserialize: deserialize_DocumentList,
  },
  getDocumentState: {
    path: '/EchoService/GetDocumentState',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.RequestById,
    responseType: message_pb.DocumentState,
    requestSerialize: serialize_RequestById,
    requestDeserialize: deserialize_RequestById,
    responseSerialize: serialize_DocumentState,
    responseDeserialize: deserialize_DocumentState,
  },
  sendBoardcastMessage: {
    path: '/EchoService/SendBoardcastMessage',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.BoardcastMessage,
    responseType: message_pb.EmptyMessage,
    requestSerialize: serialize_BoardcastMessage,
    requestDeserialize: deserialize_BoardcastMessage,
    responseSerialize: serialize_EmptyMessage,
    responseDeserialize: deserialize_EmptyMessage,
  },
  getBoardcastMessage: {
    path: '/EchoService/GetBoardcastMessage',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.RequestById,
    responseType: message_pb.BoardcastMessage,
    requestSerialize: serialize_RequestById,
    requestDeserialize: deserialize_RequestById,
    responseSerialize: serialize_BoardcastMessage,
    responseDeserialize: deserialize_BoardcastMessage,
  },
  getReplayList: {
    path: '/EchoService/GetReplayList',
    requestStream: false,
    responseStream: false,
    requestType: message_pb.RequestById,
    responseType: message_pb.ReplayList,
    requestSerialize: serialize_RequestById,
    requestDeserialize: deserialize_RequestById,
    responseSerialize: serialize_ReplayList,
    responseDeserialize: deserialize_ReplayList,
  },
  getReplay: {
    path: '/EchoService/GetReplay',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.ReplayMessage,
    responseType: message_pb.ReplayMessage,
    requestSerialize: serialize_ReplayMessage,
    requestDeserialize: deserialize_ReplayMessage,
    responseSerialize: serialize_ReplayMessage,
    responseDeserialize: deserialize_ReplayMessage,
  },
};

exports.EchoServiceClient = grpc.makeGenericClientConstructor(EchoServiceService);
