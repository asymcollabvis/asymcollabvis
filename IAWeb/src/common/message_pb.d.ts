import * as jspb from 'google-protobuf'



export class Position extends jspb.Message {
  getX(): number;
  setX(value: number): Position;

  getY(): number;
  setY(value: number): Position;

  getZ(): number;
  setZ(value: number): Position;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Position.AsObject;
  static toObject(includeInstance: boolean, msg: Position): Position.AsObject;
  static serializeBinaryToWriter(message: Position, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Position;
  static deserializeBinaryFromReader(message: Position, reader: jspb.BinaryReader): Position;
}

export namespace Position {
  export type AsObject = {
    x: number,
    y: number,
    z: number,
  }
}

export class Rotation extends jspb.Message {
  getX(): number;
  setX(value: number): Rotation;

  getY(): number;
  setY(value: number): Rotation;

  getZ(): number;
  setZ(value: number): Rotation;

  getW(): number;
  setW(value: number): Rotation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Rotation.AsObject;
  static toObject(includeInstance: boolean, msg: Rotation): Rotation.AsObject;
  static serializeBinaryToWriter(message: Rotation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Rotation;
  static deserializeBinaryFromReader(message: Rotation, reader: jspb.BinaryReader): Rotation;
}

export namespace Rotation {
  export type AsObject = {
    x: number,
    y: number,
    z: number,
    w: number,
  }
}

export class Scale extends jspb.Message {
  getX(): number;
  setX(value: number): Scale;

  getY(): number;
  setY(value: number): Scale;

  getZ(): number;
  setZ(value: number): Scale;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Scale.AsObject;
  static toObject(includeInstance: boolean, msg: Scale): Scale.AsObject;
  static serializeBinaryToWriter(message: Scale, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Scale;
  static deserializeBinaryFromReader(message: Scale, reader: jspb.BinaryReader): Scale;
}

export namespace Scale {
  export type AsObject = {
    x: number,
    y: number,
    z: number,
  }
}

export class Color extends jspb.Message {
  getX(): number;
  setX(value: number): Color;

  getY(): number;
  setY(value: number): Color;

  getZ(): number;
  setZ(value: number): Color;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Color.AsObject;
  static toObject(includeInstance: boolean, msg: Color): Color.AsObject;
  static serializeBinaryToWriter(message: Color, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Color;
  static deserializeBinaryFromReader(message: Color, reader: jspb.BinaryReader): Color;
}

export namespace Color {
  export type AsObject = {
    x: number,
    y: number,
    z: number,
  }
}

export class SpatialInfo extends jspb.Message {
  getPosition(): Position | undefined;
  setPosition(value?: Position): SpatialInfo;
  hasPosition(): boolean;
  clearPosition(): SpatialInfo;

  getRotation(): Rotation | undefined;
  setRotation(value?: Rotation): SpatialInfo;
  hasRotation(): boolean;
  clearRotation(): SpatialInfo;

  getScale(): Scale | undefined;
  setScale(value?: Scale): SpatialInfo;
  hasScale(): boolean;
  clearScale(): SpatialInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpatialInfo.AsObject;
  static toObject(includeInstance: boolean, msg: SpatialInfo): SpatialInfo.AsObject;
  static serializeBinaryToWriter(message: SpatialInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpatialInfo;
  static deserializeBinaryFromReader(message: SpatialInfo, reader: jspb.BinaryReader): SpatialInfo;
}

export namespace SpatialInfo {
  export type AsObject = {
    position?: Position.AsObject,
    rotation?: Rotation.AsObject,
    scale?: Scale.AsObject,
  }
}

export class Frustum extends jspb.Message {
  getN1(): Position | undefined;
  setN1(value?: Position): Frustum;
  hasN1(): boolean;
  clearN1(): Frustum;

  getN2(): Position | undefined;
  setN2(value?: Position): Frustum;
  hasN2(): boolean;
  clearN2(): Frustum;

  getN3(): Position | undefined;
  setN3(value?: Position): Frustum;
  hasN3(): boolean;
  clearN3(): Frustum;

  getN4(): Position | undefined;
  setN4(value?: Position): Frustum;
  hasN4(): boolean;
  clearN4(): Frustum;

  getF1(): Position | undefined;
  setF1(value?: Position): Frustum;
  hasF1(): boolean;
  clearF1(): Frustum;

  getF2(): Position | undefined;
  setF2(value?: Position): Frustum;
  hasF2(): boolean;
  clearF2(): Frustum;

  getF3(): Position | undefined;
  setF3(value?: Position): Frustum;
  hasF3(): boolean;
  clearF3(): Frustum;

  getF4(): Position | undefined;
  setF4(value?: Position): Frustum;
  hasF4(): boolean;
  clearF4(): Frustum;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Frustum.AsObject;
  static toObject(includeInstance: boolean, msg: Frustum): Frustum.AsObject;
  static serializeBinaryToWriter(message: Frustum, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Frustum;
  static deserializeBinaryFromReader(message: Frustum, reader: jspb.BinaryReader): Frustum;
}

export namespace Frustum {
  export type AsObject = {
    n1?: Position.AsObject,
    n2?: Position.AsObject,
    n3?: Position.AsObject,
    n4?: Position.AsObject,
    f1?: Position.AsObject,
    f2?: Position.AsObject,
    f3?: Position.AsObject,
    f4?: Position.AsObject,
  }
}

export class UserInfo extends jspb.Message {
  getId(): string;
  setId(value: string): UserInfo;

  getType(): UserInfo.ClientType;
  setType(value: UserInfo.ClientType): UserInfo;

  getRoomid(): string;
  setRoomid(value: string): UserInfo;

  getHeadspatialinfo(): SpatialInfo | undefined;
  setHeadspatialinfo(value?: SpatialInfo): UserInfo;
  hasHeadspatialinfo(): boolean;
  clearHeadspatialinfo(): UserInfo;

  getLeftcontrollerspatialinfo(): SpatialInfo | undefined;
  setLeftcontrollerspatialinfo(value?: SpatialInfo): UserInfo;
  hasLeftcontrollerspatialinfo(): boolean;
  clearLeftcontrollerspatialinfo(): UserInfo;

  getRightcontrollerspatialinfo(): SpatialInfo | undefined;
  setRightcontrollerspatialinfo(value?: SpatialInfo): UserInfo;
  hasRightcontrollerspatialinfo(): boolean;
  clearRightcontrollerspatialinfo(): UserInfo;

  getFrustum(): Frustum | undefined;
  setFrustum(value?: Frustum): UserInfo;
  hasFrustum(): boolean;
  clearFrustum(): UserInfo;

  getDocumentid(): string;
  setDocumentid(value: string): UserInfo;

  getDataset(): string;
  setDataset(value: string): UserInfo;

  getGraphspatialinfo(): SpatialInfo | undefined;
  setGraphspatialinfo(value?: SpatialInfo): UserInfo;
  hasGraphspatialinfo(): boolean;
  clearGraphspatialinfo(): UserInfo;

  getDocumentpanelspatialinfo(): SpatialInfo | undefined;
  setDocumentpanelspatialinfo(value?: SpatialInfo): UserInfo;
  hasDocumentpanelspatialinfo(): boolean;
  clearDocumentpanelspatialinfo(): UserInfo;

  getNearcursornodeidsList(): Array<string>;
  setNearcursornodeidsList(value: Array<string>): UserInfo;
  clearNearcursornodeidsList(): UserInfo;
  addNearcursornodeids(value: string, index?: number): UserInfo;

  getNearcursornodeweightsList(): Array<number>;
  setNearcursornodeweightsList(value: Array<number>): UserInfo;
  clearNearcursornodeweightsList(): UserInfo;
  addNearcursornodeweights(value: number, index?: number): UserInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserInfo.AsObject;
  static toObject(includeInstance: boolean, msg: UserInfo): UserInfo.AsObject;
  static serializeBinaryToWriter(message: UserInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserInfo;
  static deserializeBinaryFromReader(message: UserInfo, reader: jspb.BinaryReader): UserInfo;
}

export namespace UserInfo {
  export type AsObject = {
    id: string,
    type: UserInfo.ClientType,
    roomid: string,
    headspatialinfo?: SpatialInfo.AsObject,
    leftcontrollerspatialinfo?: SpatialInfo.AsObject,
    rightcontrollerspatialinfo?: SpatialInfo.AsObject,
    frustum?: Frustum.AsObject,
    documentid: string,
    dataset: string,
    graphspatialinfo?: SpatialInfo.AsObject,
    documentpanelspatialinfo?: SpatialInfo.AsObject,
    nearcursornodeidsList: Array<string>,
    nearcursornodeweightsList: Array<number>,
  }

  export enum ClientType { 
    DESKTOP = 0,
    VR = 1,
  }
}

export class UserList extends jspb.Message {
  getUsersList(): Array<UserInfo>;
  setUsersList(value: Array<UserInfo>): UserList;
  clearUsersList(): UserList;
  addUsers(value?: UserInfo, index?: number): UserInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserList.AsObject;
  static toObject(includeInstance: boolean, msg: UserList): UserList.AsObject;
  static serializeBinaryToWriter(message: UserList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserList;
  static deserializeBinaryFromReader(message: UserList, reader: jspb.BinaryReader): UserList;
}

export namespace UserList {
  export type AsObject = {
    usersList: Array<UserInfo.AsObject>,
  }
}

export class Node extends jspb.Message {
  getRoomid(): string;
  setRoomid(value: string): Node;

  getId(): string;
  setId(value: string): Node;

  getSpatialinfo(): SpatialInfo | undefined;
  setSpatialinfo(value?: SpatialInfo): Node;
  hasSpatialinfo(): boolean;
  clearSpatialinfo(): Node;

  getName(): string;
  setName(value: string): Node;

  getData(): string;
  setData(value: string): Node;

  getCreatedfrom(): string;
  setCreatedfrom(value: string): Node;

  getCreatedby(): string;
  setCreatedby(value: string): Node;

  getHighlightedbyList(): Array<string>;
  setHighlightedbyList(value: Array<string>): Node;
  clearHighlightedbyList(): Node;
  addHighlightedby(value: string, index?: number): Node;

  getReferencesList(): Array<DocumentReference>;
  setReferencesList(value: Array<DocumentReference>): Node;
  clearReferencesList(): Node;
  addReferences(value?: DocumentReference, index?: number): DocumentReference;

  getUpdatedby(): string;
  setUpdatedby(value: string): Node;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Node.AsObject;
  static toObject(includeInstance: boolean, msg: Node): Node.AsObject;
  static serializeBinaryToWriter(message: Node, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Node;
  static deserializeBinaryFromReader(message: Node, reader: jspb.BinaryReader): Node;
}

export namespace Node {
  export type AsObject = {
    roomid: string,
    id: string,
    spatialinfo?: SpatialInfo.AsObject,
    name: string,
    data: string,
    createdfrom: string,
    createdby: string,
    highlightedbyList: Array<string>,
    referencesList: Array<DocumentReference.AsObject>,
    updatedby: string,
  }
}

export class DocumentReference extends jspb.Message {
  getDocid(): string;
  setDocid(value: string): DocumentReference;

  getStartindex(): number;
  setStartindex(value: number): DocumentReference;

  getEndindex(): number;
  setEndindex(value: number): DocumentReference;

  getCreatedby(): string;
  setCreatedby(value: string): DocumentReference;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentReference.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentReference): DocumentReference.AsObject;
  static serializeBinaryToWriter(message: DocumentReference, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentReference;
  static deserializeBinaryFromReader(message: DocumentReference, reader: jspb.BinaryReader): DocumentReference;
}

export namespace DocumentReference {
  export type AsObject = {
    docid: string,
    startindex: number,
    endindex: number,
    createdby: string,
  }
}

export class NodeSpatialInfo extends jspb.Message {
  getRoomid(): string;
  setRoomid(value: string): NodeSpatialInfo;

  getId(): string;
  setId(value: string): NodeSpatialInfo;

  getSpatialinfo(): SpatialInfo | undefined;
  setSpatialinfo(value?: SpatialInfo): NodeSpatialInfo;
  hasSpatialinfo(): boolean;
  clearSpatialinfo(): NodeSpatialInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeSpatialInfo.AsObject;
  static toObject(includeInstance: boolean, msg: NodeSpatialInfo): NodeSpatialInfo.AsObject;
  static serializeBinaryToWriter(message: NodeSpatialInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeSpatialInfo;
  static deserializeBinaryFromReader(message: NodeSpatialInfo, reader: jspb.BinaryReader): NodeSpatialInfo;
}

export namespace NodeSpatialInfo {
  export type AsObject = {
    roomid: string,
    id: string,
    spatialinfo?: SpatialInfo.AsObject,
  }
}

export class NodeList extends jspb.Message {
  getSpatialinfosList(): Array<NodeSpatialInfo>;
  setSpatialinfosList(value: Array<NodeSpatialInfo>): NodeList;
  clearSpatialinfosList(): NodeList;
  addSpatialinfos(value?: NodeSpatialInfo, index?: number): NodeSpatialInfo;

  getRoomid(): string;
  setRoomid(value: string): NodeList;

  getUserid(): string;
  setUserid(value: string): NodeList;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeList.AsObject;
  static toObject(includeInstance: boolean, msg: NodeList): NodeList.AsObject;
  static serializeBinaryToWriter(message: NodeList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeList;
  static deserializeBinaryFromReader(message: NodeList, reader: jspb.BinaryReader): NodeList;
}

export namespace NodeList {
  export type AsObject = {
    spatialinfosList: Array<NodeSpatialInfo.AsObject>,
    roomid: string,
    userid: string,
  }
}

export class Link extends jspb.Message {
  getSource(): number;
  setSource(value: number): Link;

  getTarget(): number;
  setTarget(value: number): Link;

  getId(): string;
  setId(value: string): Link;

  getName(): string;
  setName(value: string): Link;

  getData(): string;
  setData(value: string): Link;

  getRoomid(): string;
  setRoomid(value: string): Link;

  getCreatedfrom(): string;
  setCreatedfrom(value: string): Link;

  getCreatedby(): string;
  setCreatedby(value: string): Link;

  getUpdatedby(): string;
  setUpdatedby(value: string): Link;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Link.AsObject;
  static toObject(includeInstance: boolean, msg: Link): Link.AsObject;
  static serializeBinaryToWriter(message: Link, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Link;
  static deserializeBinaryFromReader(message: Link, reader: jspb.BinaryReader): Link;
}

export namespace Link {
  export type AsObject = {
    source: number,
    target: number,
    id: string,
    name: string,
    data: string,
    roomid: string,
    createdfrom: string,
    createdby: string,
    updatedby: string,
  }
}

export class LinkList extends jspb.Message {
  getLinksList(): Array<Link>;
  setLinksList(value: Array<Link>): LinkList;
  clearLinksList(): LinkList;
  addLinks(value?: Link, index?: number): Link;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LinkList.AsObject;
  static toObject(includeInstance: boolean, msg: LinkList): LinkList.AsObject;
  static serializeBinaryToWriter(message: LinkList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LinkList;
  static deserializeBinaryFromReader(message: LinkList, reader: jspb.BinaryReader): LinkList;
}

export namespace LinkList {
  export type AsObject = {
    linksList: Array<Link.AsObject>,
  }
}

export class GraphViewData extends jspb.Message {
  getNodesList(): Array<Node>;
  setNodesList(value: Array<Node>): GraphViewData;
  clearNodesList(): GraphViewData;
  addNodes(value?: Node, index?: number): Node;

  getLinksList(): Array<Link>;
  setLinksList(value: Array<Link>): GraphViewData;
  clearLinksList(): GraphViewData;
  addLinks(value?: Link, index?: number): Link;

  getSpatialinfo(): SpatialInfo | undefined;
  setSpatialinfo(value?: SpatialInfo): GraphViewData;
  hasSpatialinfo(): boolean;
  clearSpatialinfo(): GraphViewData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GraphViewData.AsObject;
  static toObject(includeInstance: boolean, msg: GraphViewData): GraphViewData.AsObject;
  static serializeBinaryToWriter(message: GraphViewData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GraphViewData;
  static deserializeBinaryFromReader(message: GraphViewData, reader: jspb.BinaryReader): GraphViewData;
}

export namespace GraphViewData {
  export type AsObject = {
    nodesList: Array<Node.AsObject>,
    linksList: Array<Link.AsObject>,
    spatialinfo?: SpatialInfo.AsObject,
  }
}

export class ClientActions extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): ClientActions;

  getClickednodesList(): Array<number>;
  setClickednodesList(value: Array<number>): ClientActions;
  clearClickednodesList(): ClientActions;
  addClickednodes(value: number, index?: number): ClientActions;

  getHoverednodesList(): Array<number>;
  setHoverednodesList(value: Array<number>): ClientActions;
  clearHoverednodesList(): ClientActions;
  addHoverednodes(value: number, index?: number): ClientActions;

  getRoomid(): string;
  setRoomid(value: string): ClientActions;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientActions.AsObject;
  static toObject(includeInstance: boolean, msg: ClientActions): ClientActions.AsObject;
  static serializeBinaryToWriter(message: ClientActions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientActions;
  static deserializeBinaryFromReader(message: ClientActions, reader: jspb.BinaryReader): ClientActions;
}

export namespace ClientActions {
  export type AsObject = {
    userid: string,
    clickednodesList: Array<number>,
    hoverednodesList: Array<number>,
    roomid: string,
  }
}

export class HighlightedList extends jspb.Message {
  getHighlightedList(): Array<number>;
  setHighlightedList(value: Array<number>): HighlightedList;
  clearHighlightedList(): HighlightedList;
  addHighlighted(value: number, index?: number): HighlightedList;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HighlightedList.AsObject;
  static toObject(includeInstance: boolean, msg: HighlightedList): HighlightedList.AsObject;
  static serializeBinaryToWriter(message: HighlightedList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HighlightedList;
  static deserializeBinaryFromReader(message: HighlightedList, reader: jspb.BinaryReader): HighlightedList;
}

export namespace HighlightedList {
  export type AsObject = {
    highlightedList: Array<number>,
  }
}

export class ServerNodesStatus extends jspb.Message {
  getHightlightedMap(): jspb.Map<string, HighlightedList>;
  clearHightlightedMap(): ServerNodesStatus;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerNodesStatus.AsObject;
  static toObject(includeInstance: boolean, msg: ServerNodesStatus): ServerNodesStatus.AsObject;
  static serializeBinaryToWriter(message: ServerNodesStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerNodesStatus;
  static deserializeBinaryFromReader(message: ServerNodesStatus, reader: jspb.BinaryReader): ServerNodesStatus;
}

export namespace ServerNodesStatus {
  export type AsObject = {
    hightlightedMap: Array<[string, HighlightedList.AsObject]>,
  }
}

export class EmptyMessage extends jspb.Message {
  getIsrecieved(): boolean;
  setIsrecieved(value: boolean): EmptyMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmptyMessage.AsObject;
  static toObject(includeInstance: boolean, msg: EmptyMessage): EmptyMessage.AsObject;
  static serializeBinaryToWriter(message: EmptyMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmptyMessage;
  static deserializeBinaryFromReader(message: EmptyMessage, reader: jspb.BinaryReader): EmptyMessage;
}

export namespace EmptyMessage {
  export type AsObject = {
    isrecieved: boolean,
  }
}

export class InitialRequest extends jspb.Message {
  getRequestedviewtype(): InitialRequest.ClientViewType;
  setRequestedviewtype(value: InitialRequest.ClientViewType): InitialRequest;

  getUserid(): string;
  setUserid(value: string): InitialRequest;

  getRoomid(): string;
  setRoomid(value: string): InitialRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitialRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitialRequest): InitialRequest.AsObject;
  static serializeBinaryToWriter(message: InitialRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitialRequest;
  static deserializeBinaryFromReader(message: InitialRequest, reader: jspb.BinaryReader): InitialRequest;
}

export namespace InitialRequest {
  export type AsObject = {
    requestedviewtype: InitialRequest.ClientViewType,
    userid: string,
    roomid: string,
  }

  export enum ClientViewType { 
    VIEW_2D = 0,
    VIEW_3D = 1,
  }
}

export class InitialGraphData extends jspb.Message {
  getGraphviewdata(): GraphViewData | undefined;
  setGraphviewdata(value?: GraphViewData): InitialGraphData;
  hasGraphviewdata(): boolean;
  clearGraphviewdata(): InitialGraphData;

  getNodesstatus(): ServerNodesStatus | undefined;
  setNodesstatus(value?: ServerNodesStatus): InitialGraphData;
  hasNodesstatus(): boolean;
  clearNodesstatus(): InitialGraphData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitialGraphData.AsObject;
  static toObject(includeInstance: boolean, msg: InitialGraphData): InitialGraphData.AsObject;
  static serializeBinaryToWriter(message: InitialGraphData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitialGraphData;
  static deserializeBinaryFromReader(message: InitialGraphData, reader: jspb.BinaryReader): InitialGraphData;
}

export namespace InitialGraphData {
  export type AsObject = {
    graphviewdata?: GraphViewData.AsObject,
    nodesstatus?: ServerNodesStatus.AsObject,
  }
}

export class Room extends jspb.Message {
  getId(): string;
  setId(value: string): Room;

  getUsersList(): Array<UserInfo>;
  setUsersList(value: Array<UserInfo>): Room;
  clearUsersList(): Room;
  addUsers(value?: UserInfo, index?: number): UserInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Room.AsObject;
  static toObject(includeInstance: boolean, msg: Room): Room.AsObject;
  static serializeBinaryToWriter(message: Room, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Room;
  static deserializeBinaryFromReader(message: Room, reader: jspb.BinaryReader): Room;
}

export namespace Room {
  export type AsObject = {
    id: string,
    usersList: Array<UserInfo.AsObject>,
  }
}

export class RoomList extends jspb.Message {
  getRoomsList(): Array<Room>;
  setRoomsList(value: Array<Room>): RoomList;
  clearRoomsList(): RoomList;
  addRooms(value?: Room, index?: number): Room;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RoomList.AsObject;
  static toObject(includeInstance: boolean, msg: RoomList): RoomList.AsObject;
  static serializeBinaryToWriter(message: RoomList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RoomList;
  static deserializeBinaryFromReader(message: RoomList, reader: jspb.BinaryReader): RoomList;
}

export namespace RoomList {
  export type AsObject = {
    roomsList: Array<Room.AsObject>,
  }
}

export class JoinResponse extends jspb.Message {
  getError(): string;
  setError(value: string): JoinResponse;

  getMsg(): string;
  setMsg(value: string): JoinResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JoinResponse.AsObject;
  static toObject(includeInstance: boolean, msg: JoinResponse): JoinResponse.AsObject;
  static serializeBinaryToWriter(message: JoinResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JoinResponse;
  static deserializeBinaryFromReader(message: JoinResponse, reader: jspb.BinaryReader): JoinResponse;
}

export namespace JoinResponse {
  export type AsObject = {
    error: string,
    msg: string,
  }
}

export class ServerGraphStatus extends jspb.Message {
  getNodesstatus(): ServerNodesStatus | undefined;
  setNodesstatus(value?: ServerNodesStatus): ServerGraphStatus;
  hasNodesstatus(): boolean;
  clearNodesstatus(): ServerGraphStatus;

  getInitialgraphdata(): InitialGraphData | undefined;
  setInitialgraphdata(value?: InitialGraphData): ServerGraphStatus;
  hasInitialgraphdata(): boolean;
  clearInitialgraphdata(): ServerGraphStatus;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerGraphStatus.AsObject;
  static toObject(includeInstance: boolean, msg: ServerGraphStatus): ServerGraphStatus.AsObject;
  static serializeBinaryToWriter(message: ServerGraphStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerGraphStatus;
  static deserializeBinaryFromReader(message: ServerGraphStatus, reader: jspb.BinaryReader): ServerGraphStatus;
}

export namespace ServerGraphStatus {
  export type AsObject = {
    nodesstatus?: ServerNodesStatus.AsObject,
    initialgraphdata?: InitialGraphData.AsObject,
  }
}

export class Document extends jspb.Message {
  getId(): string;
  setId(value: string): Document;

  getTitle(): string;
  setTitle(value: string): Document;

  getDate(): string;
  setDate(value: string): Document;

  getAuthor(): string;
  setAuthor(value: string): Document;

  getContent(): string;
  setContent(value: string): Document;

  getFilename(): string;
  setFilename(value: string): Document;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Document.AsObject;
  static toObject(includeInstance: boolean, msg: Document): Document.AsObject;
  static serializeBinaryToWriter(message: Document, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Document;
  static deserializeBinaryFromReader(message: Document, reader: jspb.BinaryReader): Document;
}

export namespace Document {
  export type AsObject = {
    id: string,
    title: string,
    date: string,
    author: string,
    content: string,
    filename: string,
  }
}

export class DocumentList extends jspb.Message {
  getDocumentsList(): Array<Document>;
  setDocumentsList(value: Array<Document>): DocumentList;
  clearDocumentsList(): DocumentList;
  addDocuments(value?: Document, index?: number): Document;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentList.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentList): DocumentList.AsObject;
  static serializeBinaryToWriter(message: DocumentList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentList;
  static deserializeBinaryFromReader(message: DocumentList, reader: jspb.BinaryReader): DocumentList;
}

export namespace DocumentList {
  export type AsObject = {
    documentsList: Array<Document.AsObject>,
  }
}

export class IdList extends jspb.Message {
  getIdsList(): Array<string>;
  setIdsList(value: Array<string>): IdList;
  clearIdsList(): IdList;
  addIds(value: string, index?: number): IdList;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IdList.AsObject;
  static toObject(includeInstance: boolean, msg: IdList): IdList.AsObject;
  static serializeBinaryToWriter(message: IdList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IdList;
  static deserializeBinaryFromReader(message: IdList, reader: jspb.BinaryReader): IdList;
}

export namespace IdList {
  export type AsObject = {
    idsList: Array<string>,
  }
}

export class DocumentState extends jspb.Message {
  getDocumentstatesMap(): jspb.Map<string, IdList>;
  clearDocumentstatesMap(): DocumentState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DocumentState.AsObject;
  static toObject(includeInstance: boolean, msg: DocumentState): DocumentState.AsObject;
  static serializeBinaryToWriter(message: DocumentState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DocumentState;
  static deserializeBinaryFromReader(message: DocumentState, reader: jspb.BinaryReader): DocumentState;
}

export namespace DocumentState {
  export type AsObject = {
    documentstatesMap: Array<[string, IdList.AsObject]>,
  }
}

export class RequestById extends jspb.Message {
  getId(): string;
  setId(value: string): RequestById;

  getUserid(): string;
  setUserid(value: string): RequestById;

  getRoomid(): string;
  setRoomid(value: string): RequestById;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RequestById.AsObject;
  static toObject(includeInstance: boolean, msg: RequestById): RequestById.AsObject;
  static serializeBinaryToWriter(message: RequestById, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RequestById;
  static deserializeBinaryFromReader(message: RequestById, reader: jspb.BinaryReader): RequestById;
}

export namespace RequestById {
  export type AsObject = {
    id: string,
    userid: string,
    roomid: string,
  }
}

export class BoardcastMessage extends jspb.Message {
  getMsg(): string;
  setMsg(value: string): BoardcastMessage;

  getUserid(): string;
  setUserid(value: string): BoardcastMessage;

  getAction(): BoardcastMessage.Action;
  setAction(value: BoardcastMessage.Action): BoardcastMessage;

  getRoomid(): string;
  setRoomid(value: string): BoardcastMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoardcastMessage.AsObject;
  static toObject(includeInstance: boolean, msg: BoardcastMessage): BoardcastMessage.AsObject;
  static serializeBinaryToWriter(message: BoardcastMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoardcastMessage;
  static deserializeBinaryFromReader(message: BoardcastMessage, reader: jspb.BinaryReader): BoardcastMessage;
}

export namespace BoardcastMessage {
  export type AsObject = {
    msg: string,
    userid: string,
    action: BoardcastMessage.Action,
    roomid: string,
  }

  export enum Action { 
    HIGHLIGHT = 0,
  }
}

export class ReplayMessage extends jspb.Message {
  getMsg(): string;
  setMsg(value: string): ReplayMessage;

  getUserid(): string;
  setUserid(value: string): ReplayMessage;

  getRoomid(): string;
  setRoomid(value: string): ReplayMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReplayMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ReplayMessage): ReplayMessage.AsObject;
  static serializeBinaryToWriter(message: ReplayMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReplayMessage;
  static deserializeBinaryFromReader(message: ReplayMessage, reader: jspb.BinaryReader): ReplayMessage;
}

export namespace ReplayMessage {
  export type AsObject = {
    msg: string,
    userid: string,
    roomid: string,
  }
}

export class ReplayRecord extends jspb.Message {
  getUserid(): string;
  setUserid(value: string): ReplayRecord;

  getRoomid(): string;
  setRoomid(value: string): ReplayRecord;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReplayRecord.AsObject;
  static toObject(includeInstance: boolean, msg: ReplayRecord): ReplayRecord.AsObject;
  static serializeBinaryToWriter(message: ReplayRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReplayRecord;
  static deserializeBinaryFromReader(message: ReplayRecord, reader: jspb.BinaryReader): ReplayRecord;
}

export namespace ReplayRecord {
  export type AsObject = {
    userid: string,
    roomid: string,
  }
}

export class ReplayList extends jspb.Message {
  getRecordsList(): Array<ReplayRecord>;
  setRecordsList(value: Array<ReplayRecord>): ReplayList;
  clearRecordsList(): ReplayList;
  addRecords(value?: ReplayRecord, index?: number): ReplayRecord;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReplayList.AsObject;
  static toObject(includeInstance: boolean, msg: ReplayList): ReplayList.AsObject;
  static serializeBinaryToWriter(message: ReplayList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReplayList;
  static deserializeBinaryFromReader(message: ReplayList, reader: jspb.BinaryReader): ReplayList;
}

export namespace ReplayList {
  export type AsObject = {
    recordsList: Array<ReplayRecord.AsObject>,
  }
}

