import { Line, Sphere } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef } from "react";
import { selectSelectedText } from "../features/document/documentSlice";
import {
  selectIsMoveNode,
  selectNodesRaw,
  selectSelectedNodeIds,
  setToBeCreatedNodePosition,
} from "../features/graph/graphSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import store from "../store";
import * as THREE from "three";

const temp = new THREE.Vector3();
export function NodeCreator({ graph }: { graph: () => THREE.Group }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport, camera } = useThree();
  const selector = useAppSelector;
  const dispatch = useAppDispatch();
  const nodesRaw = selector(selectNodesRaw);
  const selectedText = selector(selectSelectedText);
  const selectedNodeIds = selector(selectSelectedNodeIds).map((id) => {
    return nodesRaw.findIndex((node) => id === +node.getId());
  });
  const isMoveNode = selector(selectIsMoveNode);

  useFrame(({ mouse }) => {
    const x = (mouse.x * viewport.width) / 2 + camera.position.x;
    const y = (mouse.y * viewport.height) / 2 + camera.position.y;
    if (groupRef.current) {
      groupRef.current.position.set(x, y, 0);
    }
    temp.set(x, y, 0);
    if (graph()) {
      graph().worldToLocal(temp);
      dispatch(setToBeCreatedNodePosition({ x: temp.x, y: temp.y }));
    }
  });

  function drawPreview() {
    if (selectedNodeIds.length == 2) {
      return (
        <Line
          points={selectedNodeIds.map((id) =>
            store.getState().graph.nodes[id].map((v) => v * 0.005)
          )}
          color="green"
          lineWidth={1}
        ></Line>
      );
    } else if (selectedNodeIds.length == 0 || isMoveNode) {
      return (
        <Sphere ref={groupRef} args={[1, 10, 10]} scale={[0.02, 0.02, 0.02]}>
          <meshBasicMaterial attach="material" color="green" />
        </Sphere>
      );
    }
  }

  return <group>{(selectedText || isMoveNode) && drawPreview()}</group>;
}
