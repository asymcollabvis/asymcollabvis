import NavigationIcon from "@mui/icons-material/Navigation";
import { Cone, Html, Sphere, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import store from "../store";
import * as THREE from "three";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../hooks";
import { selectUser } from "../features/user/userSlice";
import { UserInfo } from "./message_pb";
import { useDeviceCamera } from "./helper";

export default function Cursor({
  userId,
  temp = new THREE.Vector3(),
  temp2 = new THREE.Vector3(),
}: {
  userId: string;
  temp?: THREE.Vector3;
  temp2?: THREE.Vector3;
}) {
  const ref = useRef<THREE.Object3D>(null!);
  const selector = useAppSelector;
  const user = selector(selectUser);
  const vrCursorRef = useRef<THREE.Object3D>(null!);
  const camera = useDeviceCamera();

  function getEnv() {
    return user?.getType();
  }

  useFrame(() => {
    const nearCursorNodes = store.getState().room.nearCursorNodes[userId];
    const nodes = store.getState().graph.nodes;
    const nodesRaw = store.getState().graph.nodesRaw;
    // console.log(nearCursorNodes);

    if (nearCursorNodes && nearCursorNodes.length > 0) {
      // ref.current.visible = true;

      // calculate weighted sum
      temp.set(0, 0, 0);
      nearCursorNodes.forEach((node) => {
        const { nodeId, weight } = node;
        const index = nodesRaw.findIndex((node) => +node.getId() === nodeId);
        if (index == -1) return;
        const nodePos = nodes[index];
        if (nodePos) {
          temp2.set(nodePos[0], nodePos[1], nodePos[2]).multiplyScalar(weight);
          temp.add(temp2);
        }
      });
      //   console.log(temp, nearCursorNodes.map((node) => node.nodeId));

      ref.current.position.copy(temp);
    } else {
      // ref.current.visible = false;
    }

    if (vrCursorRef.current) {
      camera.getWorldPosition(temp);
      vrCursorRef.current.lookAt(temp);
    }
  });

  function drawCursorInPC() {
    return (
      <Html distanceFactor={0.002} wrapperClass="nodelinkLabel">
        <Grid container direction="row" alignItems="center" wrap="nowrap">
          <Grid item>
            <NavigationIcon
              sx={{
                color: store.getState().room.color(userId),
                transform: "rotateZ(-45deg)",
              }}
            />
          </Grid>
          <Grid item>{userId}</Grid>
        </Grid>
      </Html>
    );
  }

  function drawCursorInVR() {
    return (
      <group ref={vrCursorRef}>
        <group scale={5} rotation={[0, 0, Math.PI / 4]}>
          <Cone args={[0.6, 1.5, 10]} position={[0, -1, 0]}>
            <meshBasicMaterial color={store.getState().room.color(userId)} />
          </Cone>
        </group>
        <Text position={[7, -6, 0]} scale={50} color="black" anchorX={"left"} anchorY={"middle"}>{userId}</Text>
      </group>
    );
  }

  return (
    <group ref={ref}>
      {getEnv() == UserInfo.ClientType.DESKTOP
        ? drawCursorInPC()
        : getEnv() == UserInfo.ClientType.VR
        ? drawCursorInVR()
        : null}
    </group>
  );
}
