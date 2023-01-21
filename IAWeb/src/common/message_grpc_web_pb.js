/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = require('./message_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.EchoServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.EchoServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.InitialRequest,
 *   !proto.InitialGraphData>}
 */
const methodDescriptor_EchoService_GetInitialGraphData = new grpc.web.MethodDescriptor(
  '/EchoService/GetInitialGraphData',
  grpc.web.MethodType.UNARY,
  proto.InitialRequest,
  proto.InitialGraphData,
  /**
   * @param {!proto.InitialRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.InitialGraphData.deserializeBinary
);


/**
 * @param {!proto.InitialRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.InitialGraphData)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.InitialGraphData>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getInitialGraphData =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/GetInitialGraphData',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetInitialGraphData,
      callback);
};


/**
 * @param {!proto.InitialRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.InitialGraphData>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.getInitialGraphData =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/GetInitialGraphData',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetInitialGraphData);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.ClientActions,
 *   !proto.ServerNodesStatus>}
 */
const methodDescriptor_EchoService_UpdateNodesStatus = new grpc.web.MethodDescriptor(
  '/EchoService/UpdateNodesStatus',
  grpc.web.MethodType.UNARY,
  proto.ClientActions,
  proto.ServerNodesStatus,
  /**
   * @param {!proto.ClientActions} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.ServerNodesStatus.deserializeBinary
);


/**
 * @param {!proto.ClientActions} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.ServerNodesStatus)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.ServerNodesStatus>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.updateNodesStatus =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/UpdateNodesStatus',
      request,
      metadata || {},
      methodDescriptor_EchoService_UpdateNodesStatus,
      callback);
};


/**
 * @param {!proto.ClientActions} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.ServerNodesStatus>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.updateNodesStatus =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/UpdateNodesStatus',
      request,
      metadata || {},
      methodDescriptor_EchoService_UpdateNodesStatus);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RequestById,
 *   !proto.GraphViewData>}
 */
const methodDescriptor_EchoService_GetGraphData = new grpc.web.MethodDescriptor(
  '/EchoService/GetGraphData',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.RequestById,
  proto.GraphViewData,
  /**
   * @param {!proto.RequestById} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.GraphViewData.deserializeBinary
);


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.GraphViewData>}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getGraphData =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetGraphData',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetGraphData);
};


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.GraphViewData>}
 *     The XHR Node Readable Stream
 */
proto.EchoServicePromiseClient.prototype.getGraphData =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetGraphData',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetGraphData);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.InitialRequest,
 *   !proto.NodeList>}
 */
const methodDescriptor_EchoService_GetNodes = new grpc.web.MethodDescriptor(
  '/EchoService/GetNodes',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.InitialRequest,
  proto.NodeList,
  /**
   * @param {!proto.InitialRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.NodeList.deserializeBinary
);


/**
 * @param {!proto.InitialRequest} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.NodeList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getNodes =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetNodes',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetNodes);
};


/**
 * @param {!proto.InitialRequest} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.NodeList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServicePromiseClient.prototype.getNodes =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetNodes',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetNodes);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RequestById,
 *   !proto.LinkList>}
 */
const methodDescriptor_EchoService_GetLinks = new grpc.web.MethodDescriptor(
  '/EchoService/GetLinks',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.RequestById,
  proto.LinkList,
  /**
   * @param {!proto.RequestById} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.LinkList.deserializeBinary
);


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.LinkList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getLinks =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetLinks',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetLinks);
};


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.LinkList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServicePromiseClient.prototype.getLinks =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetLinks',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetLinks);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RequestById,
 *   !proto.ServerNodesStatus>}
 */
const methodDescriptor_EchoService_GetNodesStatus = new grpc.web.MethodDescriptor(
  '/EchoService/GetNodesStatus',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.RequestById,
  proto.ServerNodesStatus,
  /**
   * @param {!proto.RequestById} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.ServerNodesStatus.deserializeBinary
);


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.ServerNodesStatus>}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getNodesStatus =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetNodesStatus',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetNodesStatus);
};


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.ServerNodesStatus>}
 *     The XHR Node Readable Stream
 */
proto.EchoServicePromiseClient.prototype.getNodesStatus =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetNodesStatus',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetNodesStatus);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.EmptyMessage,
 *   !proto.UserList>}
 */
const methodDescriptor_EchoService_GetAllUsers = new grpc.web.MethodDescriptor(
  '/EchoService/GetAllUsers',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.EmptyMessage,
  proto.UserList,
  /**
   * @param {!proto.EmptyMessage} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.UserList.deserializeBinary
);


/**
 * @param {!proto.EmptyMessage} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.UserList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getAllUsers =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetAllUsers',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetAllUsers);
};


/**
 * @param {!proto.EmptyMessage} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.UserList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServicePromiseClient.prototype.getAllUsers =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetAllUsers',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetAllUsers);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RequestById,
 *   !proto.UserList>}
 */
const methodDescriptor_EchoService_GetAllUsersByRoomId = new grpc.web.MethodDescriptor(
  '/EchoService/GetAllUsersByRoomId',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.RequestById,
  proto.UserList,
  /**
   * @param {!proto.RequestById} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.UserList.deserializeBinary
);


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.UserList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getAllUsersByRoomId =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetAllUsersByRoomId',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetAllUsersByRoomId);
};


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.UserList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServicePromiseClient.prototype.getAllUsersByRoomId =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetAllUsersByRoomId',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetAllUsersByRoomId);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.EmptyMessage,
 *   !proto.RoomList>}
 */
const methodDescriptor_EchoService_GetAllRooms = new grpc.web.MethodDescriptor(
  '/EchoService/GetAllRooms',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.EmptyMessage,
  proto.RoomList,
  /**
   * @param {!proto.EmptyMessage} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.RoomList.deserializeBinary
);


/**
 * @param {!proto.EmptyMessage} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.RoomList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getAllRooms =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetAllRooms',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetAllRooms);
};


/**
 * @param {!proto.EmptyMessage} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.RoomList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServicePromiseClient.prototype.getAllRooms =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetAllRooms',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetAllRooms);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.UserInfo,
 *   !proto.UserInfo>}
 */
const methodDescriptor_EchoService_Join = new grpc.web.MethodDescriptor(
  '/EchoService/Join',
  grpc.web.MethodType.UNARY,
  proto.UserInfo,
  proto.UserInfo,
  /**
   * @param {!proto.UserInfo} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.UserInfo.deserializeBinary
);


/**
 * @param {!proto.UserInfo} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.UserInfo)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.UserInfo>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.join =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/Join',
      request,
      metadata || {},
      methodDescriptor_EchoService_Join,
      callback);
};


/**
 * @param {!proto.UserInfo} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.UserInfo>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.join =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/Join',
      request,
      metadata || {},
      methodDescriptor_EchoService_Join);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.UserInfo,
 *   !proto.EmptyMessage>}
 */
const methodDescriptor_EchoService_Leave = new grpc.web.MethodDescriptor(
  '/EchoService/Leave',
  grpc.web.MethodType.UNARY,
  proto.UserInfo,
  proto.EmptyMessage,
  /**
   * @param {!proto.UserInfo} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.EmptyMessage.deserializeBinary
);


/**
 * @param {!proto.UserInfo} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.EmptyMessage)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.EmptyMessage>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.leave =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/Leave',
      request,
      metadata || {},
      methodDescriptor_EchoService_Leave,
      callback);
};


/**
 * @param {!proto.UserInfo} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.EmptyMessage>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.leave =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/Leave',
      request,
      metadata || {},
      methodDescriptor_EchoService_Leave);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.UserInfo,
 *   !proto.EmptyMessage>}
 */
const methodDescriptor_EchoService_UpdateUserStatus = new grpc.web.MethodDescriptor(
  '/EchoService/UpdateUserStatus',
  grpc.web.MethodType.UNARY,
  proto.UserInfo,
  proto.EmptyMessage,
  /**
   * @param {!proto.UserInfo} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.EmptyMessage.deserializeBinary
);


/**
 * @param {!proto.UserInfo} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.EmptyMessage)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.EmptyMessage>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.updateUserStatus =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/UpdateUserStatus',
      request,
      metadata || {},
      methodDescriptor_EchoService_UpdateUserStatus,
      callback);
};


/**
 * @param {!proto.UserInfo} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.EmptyMessage>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.updateUserStatus =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/UpdateUserStatus',
      request,
      metadata || {},
      methodDescriptor_EchoService_UpdateUserStatus);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Node,
 *   !proto.Node>}
 */
const methodDescriptor_EchoService_AddNode = new grpc.web.MethodDescriptor(
  '/EchoService/AddNode',
  grpc.web.MethodType.UNARY,
  proto.Node,
  proto.Node,
  /**
   * @param {!proto.Node} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.Node.deserializeBinary
);


/**
 * @param {!proto.Node} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.Node)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.Node>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.addNode =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/AddNode',
      request,
      metadata || {},
      methodDescriptor_EchoService_AddNode,
      callback);
};


/**
 * @param {!proto.Node} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.Node>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.addNode =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/AddNode',
      request,
      metadata || {},
      methodDescriptor_EchoService_AddNode);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Node,
 *   !proto.EmptyMessage>}
 */
const methodDescriptor_EchoService_UpdateNode = new grpc.web.MethodDescriptor(
  '/EchoService/UpdateNode',
  grpc.web.MethodType.UNARY,
  proto.Node,
  proto.EmptyMessage,
  /**
   * @param {!proto.Node} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.EmptyMessage.deserializeBinary
);


/**
 * @param {!proto.Node} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.EmptyMessage)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.EmptyMessage>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.updateNode =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/UpdateNode',
      request,
      metadata || {},
      methodDescriptor_EchoService_UpdateNode,
      callback);
};


/**
 * @param {!proto.Node} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.EmptyMessage>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.updateNode =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/UpdateNode',
      request,
      metadata || {},
      methodDescriptor_EchoService_UpdateNode);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Node,
 *   !proto.EmptyMessage>}
 */
const methodDescriptor_EchoService_RemoveNode = new grpc.web.MethodDescriptor(
  '/EchoService/RemoveNode',
  grpc.web.MethodType.UNARY,
  proto.Node,
  proto.EmptyMessage,
  /**
   * @param {!proto.Node} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.EmptyMessage.deserializeBinary
);


/**
 * @param {!proto.Node} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.EmptyMessage)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.EmptyMessage>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.removeNode =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/RemoveNode',
      request,
      metadata || {},
      methodDescriptor_EchoService_RemoveNode,
      callback);
};


/**
 * @param {!proto.Node} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.EmptyMessage>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.removeNode =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/RemoveNode',
      request,
      metadata || {},
      methodDescriptor_EchoService_RemoveNode);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.NodeList,
 *   !proto.EmptyMessage>}
 */
const methodDescriptor_EchoService_MergeNodes = new grpc.web.MethodDescriptor(
  '/EchoService/MergeNodes',
  grpc.web.MethodType.UNARY,
  proto.NodeList,
  proto.EmptyMessage,
  /**
   * @param {!proto.NodeList} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.EmptyMessage.deserializeBinary
);


/**
 * @param {!proto.NodeList} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.EmptyMessage)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.EmptyMessage>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.mergeNodes =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/MergeNodes',
      request,
      metadata || {},
      methodDescriptor_EchoService_MergeNodes,
      callback);
};


/**
 * @param {!proto.NodeList} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.EmptyMessage>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.mergeNodes =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/MergeNodes',
      request,
      metadata || {},
      methodDescriptor_EchoService_MergeNodes);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Link,
 *   !proto.EmptyMessage>}
 */
const methodDescriptor_EchoService_AddLink = new grpc.web.MethodDescriptor(
  '/EchoService/AddLink',
  grpc.web.MethodType.UNARY,
  proto.Link,
  proto.EmptyMessage,
  /**
   * @param {!proto.Link} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.EmptyMessage.deserializeBinary
);


/**
 * @param {!proto.Link} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.EmptyMessage)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.EmptyMessage>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.addLink =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/AddLink',
      request,
      metadata || {},
      methodDescriptor_EchoService_AddLink,
      callback);
};


/**
 * @param {!proto.Link} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.EmptyMessage>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.addLink =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/AddLink',
      request,
      metadata || {},
      methodDescriptor_EchoService_AddLink);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Link,
 *   !proto.EmptyMessage>}
 */
const methodDescriptor_EchoService_UpdateLink = new grpc.web.MethodDescriptor(
  '/EchoService/UpdateLink',
  grpc.web.MethodType.UNARY,
  proto.Link,
  proto.EmptyMessage,
  /**
   * @param {!proto.Link} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.EmptyMessage.deserializeBinary
);


/**
 * @param {!proto.Link} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.EmptyMessage)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.EmptyMessage>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.updateLink =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/UpdateLink',
      request,
      metadata || {},
      methodDescriptor_EchoService_UpdateLink,
      callback);
};


/**
 * @param {!proto.Link} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.EmptyMessage>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.updateLink =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/UpdateLink',
      request,
      metadata || {},
      methodDescriptor_EchoService_UpdateLink);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Link,
 *   !proto.EmptyMessage>}
 */
const methodDescriptor_EchoService_RemoveLink = new grpc.web.MethodDescriptor(
  '/EchoService/RemoveLink',
  grpc.web.MethodType.UNARY,
  proto.Link,
  proto.EmptyMessage,
  /**
   * @param {!proto.Link} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.EmptyMessage.deserializeBinary
);


/**
 * @param {!proto.Link} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.EmptyMessage)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.EmptyMessage>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.removeLink =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/RemoveLink',
      request,
      metadata || {},
      methodDescriptor_EchoService_RemoveLink,
      callback);
};


/**
 * @param {!proto.Link} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.EmptyMessage>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.removeLink =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/RemoveLink',
      request,
      metadata || {},
      methodDescriptor_EchoService_RemoveLink);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RequestById,
 *   !proto.Document>}
 */
const methodDescriptor_EchoService_GetDoument = new grpc.web.MethodDescriptor(
  '/EchoService/GetDoument',
  grpc.web.MethodType.UNARY,
  proto.RequestById,
  proto.Document,
  /**
   * @param {!proto.RequestById} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.Document.deserializeBinary
);


/**
 * @param {!proto.RequestById} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.Document)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.Document>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getDoument =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/GetDoument',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetDoument,
      callback);
};


/**
 * @param {!proto.RequestById} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.Document>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.getDoument =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/GetDoument',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetDoument);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RequestById,
 *   !proto.EmptyMessage>}
 */
const methodDescriptor_EchoService_UpdateDocumentState = new grpc.web.MethodDescriptor(
  '/EchoService/UpdateDocumentState',
  grpc.web.MethodType.UNARY,
  proto.RequestById,
  proto.EmptyMessage,
  /**
   * @param {!proto.RequestById} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.EmptyMessage.deserializeBinary
);


/**
 * @param {!proto.RequestById} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.EmptyMessage)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.EmptyMessage>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.updateDocumentState =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/UpdateDocumentState',
      request,
      metadata || {},
      methodDescriptor_EchoService_UpdateDocumentState,
      callback);
};


/**
 * @param {!proto.RequestById} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.EmptyMessage>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.updateDocumentState =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/UpdateDocumentState',
      request,
      metadata || {},
      methodDescriptor_EchoService_UpdateDocumentState);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RequestById,
 *   !proto.DocumentList>}
 */
const methodDescriptor_EchoService_GetAllDouments = new grpc.web.MethodDescriptor(
  '/EchoService/GetAllDouments',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.RequestById,
  proto.DocumentList,
  /**
   * @param {!proto.RequestById} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.DocumentList.deserializeBinary
);


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.DocumentList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getAllDouments =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetAllDouments',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetAllDouments);
};


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.DocumentList>}
 *     The XHR Node Readable Stream
 */
proto.EchoServicePromiseClient.prototype.getAllDouments =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetAllDouments',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetAllDouments);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RequestById,
 *   !proto.DocumentState>}
 */
const methodDescriptor_EchoService_GetDocumentState = new grpc.web.MethodDescriptor(
  '/EchoService/GetDocumentState',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.RequestById,
  proto.DocumentState,
  /**
   * @param {!proto.RequestById} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.DocumentState.deserializeBinary
);


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.DocumentState>}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getDocumentState =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetDocumentState',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetDocumentState);
};


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.DocumentState>}
 *     The XHR Node Readable Stream
 */
proto.EchoServicePromiseClient.prototype.getDocumentState =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetDocumentState',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetDocumentState);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.BoardcastMessage,
 *   !proto.EmptyMessage>}
 */
const methodDescriptor_EchoService_SendBoardcastMessage = new grpc.web.MethodDescriptor(
  '/EchoService/SendBoardcastMessage',
  grpc.web.MethodType.UNARY,
  proto.BoardcastMessage,
  proto.EmptyMessage,
  /**
   * @param {!proto.BoardcastMessage} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.EmptyMessage.deserializeBinary
);


/**
 * @param {!proto.BoardcastMessage} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.EmptyMessage)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.EmptyMessage>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.sendBoardcastMessage =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/SendBoardcastMessage',
      request,
      metadata || {},
      methodDescriptor_EchoService_SendBoardcastMessage,
      callback);
};


/**
 * @param {!proto.BoardcastMessage} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.EmptyMessage>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.sendBoardcastMessage =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/SendBoardcastMessage',
      request,
      metadata || {},
      methodDescriptor_EchoService_SendBoardcastMessage);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RequestById,
 *   !proto.BoardcastMessage>}
 */
const methodDescriptor_EchoService_GetBoardcastMessage = new grpc.web.MethodDescriptor(
  '/EchoService/GetBoardcastMessage',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.RequestById,
  proto.BoardcastMessage,
  /**
   * @param {!proto.RequestById} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.BoardcastMessage.deserializeBinary
);


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.BoardcastMessage>}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getBoardcastMessage =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetBoardcastMessage',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetBoardcastMessage);
};


/**
 * @param {!proto.RequestById} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.BoardcastMessage>}
 *     The XHR Node Readable Stream
 */
proto.EchoServicePromiseClient.prototype.getBoardcastMessage =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetBoardcastMessage',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetBoardcastMessage);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RequestById,
 *   !proto.ReplayList>}
 */
const methodDescriptor_EchoService_GetReplayList = new grpc.web.MethodDescriptor(
  '/EchoService/GetReplayList',
  grpc.web.MethodType.UNARY,
  proto.RequestById,
  proto.ReplayList,
  /**
   * @param {!proto.RequestById} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.ReplayList.deserializeBinary
);


/**
 * @param {!proto.RequestById} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.ReplayList)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.ReplayList>|undefined}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getReplayList =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/EchoService/GetReplayList',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetReplayList,
      callback);
};


/**
 * @param {!proto.RequestById} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.ReplayList>}
 *     Promise that resolves to the response
 */
proto.EchoServicePromiseClient.prototype.getReplayList =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/EchoService/GetReplayList',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetReplayList);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.ReplayMessage,
 *   !proto.ReplayMessage>}
 */
const methodDescriptor_EchoService_GetReplay = new grpc.web.MethodDescriptor(
  '/EchoService/GetReplay',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.ReplayMessage,
  proto.ReplayMessage,
  /**
   * @param {!proto.ReplayMessage} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.ReplayMessage.deserializeBinary
);


/**
 * @param {!proto.ReplayMessage} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.ReplayMessage>}
 *     The XHR Node Readable Stream
 */
proto.EchoServiceClient.prototype.getReplay =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetReplay',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetReplay);
};


/**
 * @param {!proto.ReplayMessage} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.ReplayMessage>}
 *     The XHR Node Readable Stream
 */
proto.EchoServicePromiseClient.prototype.getReplay =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/EchoService/GetReplay',
      request,
      metadata || {},
      methodDescriptor_EchoService_GetReplay);
};


module.exports = proto;

