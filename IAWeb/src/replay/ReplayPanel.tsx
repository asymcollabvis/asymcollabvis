import { Box, Button, Card } from "@mui/material";
import React, { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useClient } from "../common/client";
import { InitialRequest, ReplayMessage } from "../common/message_pb";
import useRoomStream from "../common/useRoomStream";
import {
  setReplayData,
  selectReplayData,
  selectSelectedList,
} from "../features/replay/replaySlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import * as d3 from "d3";
import ReplayEventVisualization from "./ReplayEventVisualization";

import { EventType } from "../../server/common";

export default function ReplayPanel() {
  const dispatch = useAppDispatch();
  const selector = useAppSelector;
  // const { roomId, userId } = useParams();
  const client = useClient();
  // const replayData = selector(selectReplayData);
  const replayList = selector(selectSelectedList);

  const logData = useRef<{ [key: string]: {}[] }>({});
  const [loading, setLoading] = React.useState(false);

  const [data, setData] = React.useState<{}[][]>([]);
  const [dataState, setDataState] = React.useState<{
    [key: string]: {
      data?: any;
      roomId: string;
      userId: string;
    };
  }>({});

  const colorScale = useMemo(
    () => d3.scaleOrdinal(d3.schemeAccent).domain(Object.keys(EventType)),
    []
  );

  // function computeTotalTime() {
  //   if (!replayData) return;

  //   if (replayData.length === 0) {
  //     return;
  //   }

  //   const first = replayData[0];
  //   const last = replayData[replayData.length - 1];
  //   const firstTime = first.timestamp;
  //   const lastTime = last.timestamp;

  //   return <div>Total time: {lastTime - firstTime}</div>;
  // }

  useEffect(() => {
    if (!replayList) {
      return;
    }

    console.log("fetching replay data");

    setDataState({});

    replayList.forEach((id) => {
      const [userId, roomId] = id.split(" ");
      console.log(userId, roomId);

      loadReplayData(userId, roomId);
    });
  }, [replayList]);

  function loadReplayData(userId, roomId) {
    let replayMsg = new ReplayMessage();
    if (userId && roomId) {
      replayMsg.setUserid(userId);
      replayMsg.setRoomid(roomId);
      replayMsg.setMsg("start");
      let stream = client.getReplay(replayMsg);
      stream
        .on("data", (data) => {
          let json = JSON.parse(data.getMsg());
          json.timestamp = Date.parse(json.timestamp);
          let id = `${userId} ${roomId}`;
          if (logData.current[id] === undefined) {
            logData.current[id] = [];
          }
          if (json.event === EventType.UserInfo) {
            return;
          }
          logData.current[`${userId} ${roomId}`].push(json);
        })
        .on("end", () => {
          console.log("received all messages");
          // console.log(logData.current);
          // dispatch(setReplayData(logData.current.slice(0, 1000)));
          // dispatch(setReplayData(logData.current));

          setDataState((dataState) => ({
            ...dataState,
            [`${userId} ${roomId}`]: {
              roomId: roomId,
              userId: userId,
              data: logData.current[`${userId} ${roomId}`],
            },
          }));
          // setData([...data, logData.current]);

          setLoading(false);
        })
        .on("error", (err) => {
          console.log(err);
        });
    }
  }

  function render() {
    console.log(Object.keys(dataState));

    return Object.values(dataState).map((value, i) => {
      return (
        <Box component="div" key={i}>
          <div>
            {value.userId} {value.roomId}
          </div>
          <ReplayEventVisualization
            replayData={value.data}
            colorScale={colorScale}
          />
        </Box>
      );
    });
  }

  return (
    <Card sx={{ maxHeight: "100vh", overflow: "auto" }}>
      {loading && <div>Loading...</div>}

      {/* {computeTotalTime()} */}
      {render()}
    </Card>
  );
}
