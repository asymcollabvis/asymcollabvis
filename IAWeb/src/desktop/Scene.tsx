import { Sky } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { pushStatus, useClient } from "../common/client";
import { InitialRequest } from "../common/message_pb";
import useRoomStream from "../common/useRoomStream";
import VisualGuide from "../common/VisualGuide";
import Graph from "../features/graph/Graph";
import { selectUser } from "../features/user/userSlice";
import { useAppSelector } from "../hooks";
import { NodeCreator } from "./NodeCreator";
import * as THREE from "three";

export function Scene({
  dim,
  tempVector = new THREE.Vector3(),
  tempQuaternion = new THREE.Quaternion(),
}: {
  dim: InitialRequest.ClientViewType;
  tempVector?: THREE.Vector3;
  tempQuaternion?: THREE.Quaternion;
}) {
  useRoomStream(dim);

  const selector = useAppSelector;
  const user = selector(selectUser);
  const client = useClient();
  const { camera } = useThree();
  const graphRef = useRef<THREE.Group>(null!);
  const arrowRef = useRef<THREE.Group>(null!);
  const interval = useRef<NodeJS.Timer>();

  useFrame(() => {
    // update arrow position
    arrowRef.current.position.x = camera.position.x;
    arrowRef.current.position.y = camera.position.y;
  });

  useEffect(() => {
    interval.current = setInterval(() => {
      // push user info to server
      pushStatus(
        user,
        camera,
        undefined,
        undefined,
        tempVector,
        tempQuaternion
      );
    }, (1 / 10) * 1000); // 10 times per second

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <>
      <Sky />

      <Graph ref={graphRef} dim={dim} scale={[0.005, 0.005, 0.005]} />

      <ambientLight intensity={0.8} />
      {/* <directionalLight position={[0, 0, 1]} intensity={0.5} /> */}

      <NodeCreator graph={() => graphRef.current} />
      <VisualGuide ref={arrowRef} graph={() => graphRef.current} />
    </>
  );
}
