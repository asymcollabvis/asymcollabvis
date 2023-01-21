import React, { Suspense, useEffect, useImperativeHandle, useRef } from "react";
import { forwardRef } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Box } from "@react-three/drei";
import { selectBoardcastMessage } from "../features/user/userSlice";
import { useAppSelector } from "../hooks";
import * as THREE from "three";
import { BoardcastMessage } from "./message_pb";
import store from "../store";
import { Interactive } from "@react-three/xr";

const temp = new THREE.Vector3();
export default forwardRef<THREE.Group, { graph: () => THREE.Object3D }>(
  ({ graph }, ref) => {
    const { nodes, materials } = useLoader(GLTFLoader, "/arrow.glb");
    // console.log(gltf);
    // const obj = useLoader(OBJLoader, '/arrow.obj')

    const groupRef = useRef<THREE.Group>(null!);
    useImperativeHandle(ref, () => groupRef.current);

    const selector = useAppSelector;
    const msg = selector(selectBoardcastMessage);

    const [shouldShow, setShouldShow] = React.useState(false);
    const targetNodeIndex = useRef<number>(0);

    useEffect(() => {
      console.log("get msg", msg);

      if (msg?.action === BoardcastMessage.Action.HIGHLIGHT) {
        setShouldShow(true);

        targetNodeIndex.current = store
          .getState()
          .graph.nodesRaw.findIndex((n) => n.getId() === msg?.msg);
      }
    }, [msg]);

    useFrame(() => {
      if (shouldShow) {
        let targetNodePos =
          store.getState().graph.nodes[targetNodeIndex.current];
        temp.set(targetNodePos[0], targetNodePos[1], targetNodePos[2]);
        if (graph()) {
          graph().localToWorld(temp);
          groupRef.current.lookAt(temp);
        }
      }
    });

    return (
      <group ref={groupRef} dispose={null}>
        {shouldShow && (
          <Interactive onSelect={() => setShouldShow(false)}>
            <mesh
              geometry={nodes.Cube.geometry}
              scale={[0.01, 0.01, -0.01]}
              onClick={() => {
                setShouldShow(false);
              }}
            >
              <meshStandardMaterial color={"green"} />
            </mesh>
          </Interactive>
        )}
      </group>
    );
  }
);
