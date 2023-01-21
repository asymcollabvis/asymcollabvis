import React, { useCallback, useEffect } from "react";
import { useAppSelector } from "../../hooks";
import { selectNodes, selectNodesRaw } from "./graphSlice";
import { Html, Text } from "@react-three/drei";
import { selectUserEnv } from "../user/userSlice";
import { UserInfo } from "../../common/message_pb";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import store from "../../store";

export default function Labels({ temp = new THREE.Vector3() }) {
  // TODO: fix this: performance issue
  console.log("labels");

  const selector = useAppSelector;
  // const nodes = selector(selectNodes);
  const nodesRaw = selector(selectNodesRaw);
  const env = selector(selectUserEnv);
  const textRefs = React.useRef<THREE.Object3D[]>([]);

  const { camera, gl } = useThree();
  const _camera = gl.xr.isPresenting ? gl.xr.getCamera() : camera;

  useFrame(() => {
    // let temp = new THREE.Vector3();

    _camera.getWorldPosition(temp);
    // console.log(temp);
    // console.log(textRefs);

    const nodes = store.getState().graph.nodes;

    textRefs.current.forEach((ref, i) => {
      if (ref && nodes[i]) {
        ref.position.set(
          nodes[i][0] + (env === UserInfo.ClientType.DESKTOP ? getOffset(i) : 0),
          nodes[i][1],
          nodes[i][2]
        );
        ref.lookAt(temp)
      };
    });
    // console.log(textRefs.current[0]);
  });

  const getName = (index: number) => {
    if (nodesRaw[index]) {
      const data = nodesRaw[index].getData();
      if (data === "document") {
        const id = nodesRaw[index].getId();
        return +id - 10000;
      } else {
        return data;
      }
    }
    return "";
  };

  const getOffset = (index: number) => {
    if (nodesRaw[index]) {
      const data = nodesRaw[index].getData();
      let size = 5;
      if (data === "document") {
        return size * 1.5 + 1;
      } else {
        return size + 0.05;
      }
    }
    return 0;
  };

  const getSize = (index: number) => {
    if (nodesRaw[index]) {
      const data = nodesRaw[index].getData();
      let size = 5;
      if (data === "document") {
        return size * 1.5;
      } else {
        return size;
      }
    }
    return 0;
  };

  return (
    <group>
      {nodesRaw.map((node, i) => {
        return env === UserInfo.ClientType.VR ? (
          <group key={i} ref={(el) => (textRefs.current[i] = el)}>
            <Text
              color="black"
              position={[getOffset(i), 0, 0]}
              scale={50}
              anchorX={"left"}
              anchorY={"middle"}
              maxWidth={0.7}
            >
              {getName(i)}
            </Text>
          </group>
        ) : (
          <group key={i} ref={(el) => (textRefs.current[i] = el)}>
            <Html
              wrapperClass={"nodelinkLabel"}
              // position={[node[0] + getOffset(i), node[1], node[2]]}
              distanceFactor={0.002}
              style={{
                transform: "translateY(-50%)",
                width: "100px",
              }}
            >
              {getName(i)}
            </Html>
          </group>
        );
      })}
    </group>
  );
}
