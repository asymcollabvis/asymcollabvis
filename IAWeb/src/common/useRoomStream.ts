import { ClientReadableStream } from "grpc-web";
import { useEffect } from "react";
import {
  setDocInfos,
  setDocumentState,
} from "../features/document/documentSlice";
import {
  setAllSelectedNodeIds,
  setLinks,
  setNodes,
  setNodesRaw,
  setSelectedNodeIds,
} from "../features/graph/graphSlice";
import {
  setNearCursorNodes,
  setUserList,
  setUserSpatialInfo,
} from "../features/room/roomSlice";
import { selectUser, setBoardcastMessage } from "../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import store from "../store";
import {
  streamBoardcastMessage,
  streamDocumentState,
  streamGraph,
  streamGraphStatus,
  streamNodes,
  streamUserList,
  useClient,
} from "./client";
import {
  UserList,
  DocumentState,
  RequestById,
  InitialRequest,
  NodeList,
  UserInfo,
  GraphViewData,
  ServerNodesStatus,
  BoardcastMessage,
  DocumentList,
} from "./message_pb";

export default function useRoomStream(
  graphType: InitialRequest.ClientViewType
) {
  const dispatch = useAppDispatch();
  const selector = useAppSelector;
  const user = selector(selectUser);
  const client = useClient();

  let stream: ClientReadableStream<UserList>;
  let documentStateStream: ClientReadableStream<DocumentState>;
  let nodesStream: ClientReadableStream<NodeList>;
  let graphStream: ClientReadableStream<GraphViewData>;
  let graphStatusStream: ClientReadableStream<ServerNodesStatus>;
  let boardcastMessageStream: ClientReadableStream<BoardcastMessage>;

  const streamUserListCallback = (response: UserList) => {
    // console.log(response.getUsersList().map(user => user.toObject()));
    let newList = response.getUsersList();
    if (store.getState().room.userList.length != newList.length) {
      dispatch(setUserList(newList));

      // TODO:  remove the removed users in the user spatial info map
    }

    newList.forEach((user) => {
      const spatialInfo = user.getHeadspatialinfo();
      const frustum = user.getFrustum();
      const cursor = user.getNearcursornodeidsList();
      const cursorWeight = user.getNearcursornodeweightsList();

      let nodes: { nodeId: number; weight: number }[] = [];
      for (let i = 0; i < cursor.length; i++) {
        nodes.push({ nodeId: +cursor[i], weight: cursorWeight[i] });
      }
      // console.log("near cursor nodes: ", { userId: user.getId(), nodes });

      dispatch(setNearCursorNodes({ userId: user.getId(), nodes }));

      if (spatialInfo) {
        dispatch(
          setUserSpatialInfo({
            id: user.getId(),
            spatialInfo,
            frustum,
          })
        );
      }
    });
  };

  useEffect(() => {
    console.log("user changed room");

    let roomId = user?.getRoomid();
    if (roomId) {
      // get user list of specific room from the server
      if (stream) {
        // cancel the current stream if any
        stream.cancel();
      }

      stream = streamUserList(roomId, streamUserListCallback);

      // get document state of specific room from the server
      if (documentStateStream) {
        // cancel the current stream if any
        documentStateStream.cancel();
      }

      documentStateStream = streamDocumentState(roomId, (response) => {
        // console.log("stream document state", response.toObject());

        dispatch(setDocumentState(response));
      });

      // get graph data
      if (graphStream) {
        // cancel the current stream if any
        graphStream.cancel();
      }

      graphStream = streamGraph(roomId, (response) => {
        dispatch(setNodesRaw(response.getNodesList() ?? []));

        let _links = (response.getLinksList() ?? []).map((link) => {
          return {
            source: link.getSource(),
            target: link.getTarget(),
            data: link.getData(),
            id: link.getId(),
          };
        });
        dispatch(setLinks(_links));
      });

      // get graph node spatial data
      if (nodesStream) {
        // cancel the current stream if any
        nodesStream.cancel();
      }

      nodesStream = streamNodes(user?.getId() ?? "", graphType, (response) => {
        dispatch(
          setNodes(
            response.getSpatialinfosList().map((v) => {
              let spatial = v.getSpatialinfo()!;
              return [
                spatial.getPosition()?.getX() ?? 0,
                spatial.getPosition()?.getY() ?? 0,
                spatial.getPosition()?.getZ() ?? 0,
              ];
            })
          )
        );
      });

      // get graph status
      if (graphStatusStream) {
        // cancel the current stream if any
        graphStatusStream.cancel();
      }

      graphStatusStream = streamGraphStatus(roomId, (response) => {
        let allSelectedNodes: {
          id: number;
          userId: string;
        }[] = [];
        let selectedNodes: number[] = [];

        response.getHightlightedMap().forEach((node, userId) => {
          if (userId == user?.getId()) {
            selectedNodes = node.getHighlightedList();
          } else {
            node.getHighlightedList().forEach((id) => {
              allSelectedNodes.push({
                id,
                userId,
              });
            });
          }
        });

        dispatch(setAllSelectedNodeIds(allSelectedNodes));

        dispatch(setSelectedNodeIds(selectedNodes));
      });

      if (boardcastMessageStream) {
        // cancel the current stream if any
        boardcastMessageStream.cancel();
      }
      boardcastMessageStream = streamBoardcastMessage(
        roomId,
        user!.getId(),
        (response) => {
          dispatch(setBoardcastMessage(response.toObject()));
        }
      );

      getDocuments();
    }
  }, [user?.getRoomid()]);

  const getDocuments = () => {
    console.log("getDocuments stream");

    let request = new RequestById();
    request.setId(user?.getId() ?? "");
    request.setUserid(user?.getId() ?? "");
    request.setRoomid(user?.getRoomid() ?? "");
    const stream = client.getAllDouments(request, {});
    stream.on("data", (response: DocumentList) => {
      let list = response.getDocumentsList();
      // console.log("documents", list.length);

      dispatch(
        setDocInfos(
          list.map((doc) => ({
            id: doc.getId(),
            title: doc.getTitle(),
            author: doc.getAuthor(),
            date: doc.getDate(),
            fileName: doc.getFilename(),
          }))
        )
      );
    });
    stream.on("end", function () {
      console.log("Stream ended");
      getDocuments();
    });
  };

  // useEffect(() => {
  //   getDocuments();
  // }, []);
}
