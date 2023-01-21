import { Line, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useController, useXREvent } from "@react-three/xr";
import React, { useImperativeHandle, useRef, useState } from "react";
import { forwardRef } from "react";
import { shallowEqual } from "react-redux";
import * as THREE from "three";
import { moveNode } from "../common/graph";
import useDragToAddNode from "../common/useDragToAddNode";
import { selectSelectedText } from "../features/document/documentSlice";
import {
  selectIsMoveNode,
  selectNodesRaw,
  selectSelectedNodeIds,
  setIsMoveNode,
  setToBeCreatedNodePosition,
} from "../features/graph/graphSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import store from "../store";
import { intersects } from "./interactions/utils";

export default function NodeCreator({
  temp = new THREE.Vector3(),
  temp2 = new THREE.Vector3(),
}: {
  temp?: THREE.Vector3;
  temp2?: THREE.Vector3;
}) {
  console.log("rendering NodeCreator");
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.Object3D>(null);

  const [canBeAdded, setCanBeAdded] = useState(false);
  const dispatch = useAppDispatch();
  const selector = useAppSelector;
  const selectedText = selector(selectSelectedText, shallowEqual);
  const nodesRaw = selector(selectNodesRaw);
  const selectedNodeIds = selector(selectSelectedNodeIds, shallowEqual).map((id) => {
    return nodesRaw.findIndex((node) => id === +node.getId());
  });
  const { dragToAddNode } = useDragToAddNode();

  const rightController = useController("right");
  const isMoveNode = selector(selectIsMoveNode);

  useFrame(() => {
    let graph = store.getState().graph.graph;
    if (!graph) return;
    graph.updateMatrixWorld();

    if (rightController) {
      // locate seleted node
      rightController.controller.getWorldDirection(temp);
      rightController.controller.getWorldPosition(temp2);
      temp2.add(temp.multiplyScalar(-0.03));

      if (groupRef.current) {
        groupRef.current.position.copy(temp2);
        // console.log(temp2);
        
        temp.copy(temp2);
        // console.log(graph.matrixWorld, graph.matrixWorld.elements);
        
        graph.worldToLocal(temp);
        // console.log(temp, graph);
        
        
        dispatch(
          setToBeCreatedNodePosition({ x: temp.x, y: temp.y, z: temp.z })
        );
      }

      // check if the rightController inside graph
      const bbox = new THREE.Box3();
      bbox.setFromObject(rightController.grip);

      if (bbox && intersects(bbox, graph)) {
        if (!canBeAdded) setCanBeAdded(true);
      } else {
        if (canBeAdded) setCanBeAdded(false);
      }
    }

    if (lineRef.current) {
      lineRef.current.geometry.setPositions(
        selectedNodeIds.flatMap((id) => {
          let [x, y, z] = store.getState().graph.nodes[id].map((v) => v);
          temp.set(x, y, z);
          graph.localToWorld(temp);

          return temp.toArray();
        })
      );
    }
  });

  useXREvent("squeeze", (e) => {
    if (e.nativeEvent.data?.handedness === "right") {
      if (canBeAdded) {
        if (selectedText) {
          dragToAddNode();
        }

        if (isMoveNode) {
          console.log("moveNode");

          // move node
          store.getState().user.userInfo &&
            moveNode(store.getState().user.userInfo, isMoveNode);

          dispatch(setIsMoveNode(undefined));
        }
      }
    }
  });

  function drawPreview() {
    let graph = store.getState().graph.graph;
    if (!graph) return;

    if (selectedNodeIds.length == 2) {
      if (canBeAdded) {
        return (
          <Line
            ref={lineRef}
            points={selectedNodeIds.map((id) =>
              store
                .getState()
                .graph.nodes[id].map(
                  (v, i) => v * 0.005 + graph.position.toArray()[i]
                )
            )}
            color="green"
            lineWidth={1}
          ></Line>
        );
      }
    } else if (selectedNodeIds.length == 0 || isMoveNode) {
      return (
        <Sphere ref={groupRef} args={[1, 10, 10]} scale={[0.02, 0.02, 0.02]}>
          <meshBasicMaterial
            attach="material"
            color={"green"}
            transparent
            opacity={canBeAdded ? 1 : 0.3}
          />
        </Sphere>
      );
    }
  }

  return <group>{(selectedText || isMoveNode) && drawPreview()}</group>;
}
