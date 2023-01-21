import { Box, Button, Card, Input } from "@mui/material";
import { MapControls, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useRef } from "react";
import { Provider, ReactReduxContext } from "react-redux";
import { useParams } from "react-router-dom";
import { moveNode, viewType } from "../common/graph";
import useDragToAddNode from "../common/useDragToAddNode";
import {
  selectSelectedText,
  setSelectedText,
} from "../features/document/documentSlice";
import { selectIsMoveNode, setIsMoveNode } from "../features/graph/graphSlice";
import {
  selectGraphControl,
  setGraphControl,
} from "../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { NodeCreator } from "./NodeCreator";
import { Scene } from "./Scene";

export function GraphView() {
  console.log("GraphView");

  let { dim } = useParams();

  const selector = useAppSelector;
  const selectedText = selector(selectSelectedText);
  const { dragToAddNode } = useDragToAddNode();
  const isMoveNode = selector(selectIsMoveNode);
  const dispatch = useAppDispatch();

  let [canAddNode, setCanAddNode] = React.useState(false);
  // const controlRef = useRef<any>(null);
  const controlRef = useCallback((node) => {
    if (node !== null) {
      dispatch(setGraphControl(node));
    }
  }, []);

  // useEffect(() => {
  //   console.log(controlRef.current);

  //   dispatch(setGraphControl(controlRef.current));
  // }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <Canvas
            orthographic
            camera={{
              far: 50,
              near: 0.01,
              zoom: 1000,
              position: [0, 0, 2],
            }}
            style={{
              border: `5px solid ${
                selectedText || isMoveNode ? "green" : "white"
              }`,
            }}
            onPointerEnter={(e) => {
              if (selectedText || isMoveNode) {
                setCanAddNode(true);
              }
            }}
            onPointerLeave={(e) => {
              if (canAddNode || isMoveNode) {
                setCanAddNode(false);
              }
            }}
            onPointerUp={(e) => {
              // if (canAddNode) {
              if (selectedText) {
                dragToAddNode();
              }

              if (isMoveNode) {
                console.log("moveNode");

                // move node
                moveNode(store.getState().user.userInfo, isMoveNode);

                dispatch(setIsMoveNode(undefined));
              }
              // }
            }}
          >
            <Provider store={store}>
              <MapControls
                screenSpacePanning={true}
                enableRotate={false}
                ref={controlRef}
              />
              <Scene dim={viewType(dim)} />
              {/* <Stats /> */}
            </Provider>
          </Canvas>
        )}
      </ReactReduxContext.Consumer>

      <Card sx={{ position: "absolute", top: 0, right: "8px" }}>
        <Button
          onClick={() => {
            dispatch(
              setSelectedText({
                text: selectedText == "" ? " " : selectedText,
                from: -1,
              })
            );
          }}
        >
          Add Node
        </Button>

        <Input
          value={selectedText}
          onChange={(e) => {
            dispatch(setSelectedText({ text: e.target.value, from: -1 }));
          }}
          onKeyUp={(e) => {
            if (e.key == "Enter") {
              dragToAddNode();
            }
          }}
        />
      </Card>
    </div>
  );
}
